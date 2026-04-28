#!/usr/bin/env python3
import json
import logging
import os
import sys
import time
from pathlib import Path

import boto3
try:
    # Import OWLET eyetracker if available
    from eyetracker import analyze_video
except ImportError:
    analyze_video = None

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger('neuroscreen-worker')

AWS_REGION = os.getenv('AWS_REGION', 'us-west-1')
SQS_QUEUE_URL = os.getenv('SQS_QUEUE_URL')
AWS_S3_BUCKET_NAME = os.getenv('AWS_S3_BUCKET_NAME')
VIDEOS_DIR = os.getenv('VIDEOS_DIR', '/tmp/neuroscreen-videos')

if not SQS_QUEUE_URL:
    logger.error('Missing SQS_QUEUE_URL environment variable')
    sys.exit(1)

if not AWS_S3_BUCKET_NAME:
    logger.error('Missing AWS_S3_BUCKET_NAME environment variable')
    sys.exit(1)

Path(VIDEOS_DIR).mkdir(parents=True, exist_ok=True)

s3_client = boto3.client('s3', region_name=AWS_REGION)
sqs_client = boto3.client('sqs', region_name=AWS_REGION)
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:4000')


def process_video(local_path: str, screening_id: str, video_number: int) -> dict:
    """Run OWLET eyetracker on video and return CSV results."""
    try:
        if not analyze_video:
            logger.warning('OWLET eyetracker not available, skipping analysis')
            return {'success': False, 'error': 'eyetracker module not imported'}
        
        logger.info('Running OWLET eyetracker on screening=%s video=%s', screening_id, video_number)
        
        # Run eyetracker analysis
        result = analyze_video(local_path)
        
        # Assume result has a CSV file path or content
        if hasattr(result, 'csv_path'):
            csv_path = result.csv_path
        elif hasattr(result, 'to_csv'):
            # If result is a DataFrame, save it
            csv_path = os.path.join(VIDEOS_DIR, f'{screening_id}_video_{video_number}_results.csv')
            result.to_csv(csv_path, index=False)
        else:
            logger.error('OWLET result has no CSV output')
            return {'success': False, 'error': 'No CSV output from eyetracker'}
        
        logger.info('✓ OWLET analysis complete. CSV: %s', csv_path)
        return {
            'success': True,
            'csv_path': csv_path,
            'csv_filename': os.path.basename(csv_path),
        }
    except Exception as e:
        logger.error('Error processing video with OWLET: %s', e)
        return {'success': False, 'error': str(e)}


def upload_csv_to_s3(csv_path: str, screening_id: str, video_number: int) -> dict:
    """Upload results CSV to S3."""
    try:
        s3_key = f"results/{screening_id}/video_{video_number}_results.csv"
        logger.info('Uploading CSV to s3://%s/%s', AWS_S3_BUCKET_NAME, s3_key)
        
        s3_client.upload_file(
            csv_path,
            AWS_S3_BUCKET_NAME,
            s3_key,
            ExtraArgs={'ContentType': 'text/csv'}
        )
        
        logger.info('✓ CSV uploaded to S3: %s', s3_key)
        return {'success': True, 's3_key': s3_key}
    except Exception as e:
        logger.error('Error uploading CSV to S3: %s', e)
        return {'success': False, 'error': str(e)}


def notify_backend(screening_id: str, video_number: int, csv_s3_key: str) -> bool:
    """Notify backend that processing is complete."""
    try:
        response = __import__('requests').post(
            f'{BACKEND_URL}/screening/{screening_id}/results',
            json={
                'videoNumber': video_number,
                'csvS3Key': csv_s3_key,
                'timestamp': int(time.time()),
            },
            timeout=10,
        )
        if response.ok:
            logger.info('✓ Backend notified of results')
            return True
        else:
            logger.warning('Backend notification failed: %s', response.status_code)
            return False
    except Exception as e:
        logger.warning('Could not notify backend: %s', e)
        return False


def handle_message(message: dict) -> bool:
    """Process SQS message from S3 event notification."""
    try:
        body = json.loads(message['Body'])

        # Parse S3 Event Notification format from bucket event
        # Format: {Records: [{s3: {object: {key: "..."}}}]}
        s3_key = None
        screening_id = None
        video_number = None

        if 'Records' in body:
            for record in body['Records']:
                if record.get('eventSource') == 'aws:s3':
                    s3_key = record['s3']['object']['key']
                    break

        if not s3_key:
            logger.error('No S3 key found in message')
            return False

        # Parse S3 key to extract screening_id and video_number
        # Key format: screenings/{screening_id}/video_{video_number}_{timestamp}.mp4
        try:
            parts = s3_key.split('/')
            if len(parts) >= 2:
                screening_id = parts[1]  # e.g., "screening-123"
                # Extract video number from filename
                filename = parts[-1]  # e.g., "video_1_1234567890.mp4"
                video_match = filename.split('_')
                if len(video_match) >= 2:
                    video_number = int(video_match[1])
        except (ValueError, IndexError) as e:
            logger.error('Failed to parse S3 key %s: %s', s3_key, e)
            return False

        if not screening_id or video_number is None:
            logger.error('Could not extract screening_id or video_number from key: %s', s3_key)
            return False

        local_file = os.path.join(
            VIDEOS_DIR,
            f"{screening_id}_{video_number}_{int(time.time())}.mp4",
        )

        logger.info('Downloading s3://%s/%s', AWS_S3_BUCKET_NAME, s3_key)
        s3_client.download_file(AWS_S3_BUCKET_NAME, s3_key, local_file)

        # Run OWLET eyetracker
        result = process_video(local_file, str(screening_id), int(video_number))

        # Clean up video file
        try:
            os.remove(local_file)
        except OSError:
            pass

        if not result.get('success'):
            logger.error('Video processing failed: %s', result.get('error'))
            return False

        # Upload CSV results to S3
        csv_path = result.get('csv_path')
        if csv_path and os.path.exists(csv_path):
            s3_result = upload_csv_to_s3(csv_path, str(screening_id), int(video_number))
            
            # Clean up CSV file
            try:
                os.remove(csv_path)
            except OSError:
                pass
            
            if s3_result.get('success'):
                # Notify backend
                notify_backend(str(screening_id), int(video_number), s3_result.get('s3_key'))
        else:
            logger.error('No CSV file found at %s', csv_path)
            return False

        # Delete message from queue
        sqs_client.delete_message(
            QueueUrl=SQS_QUEUE_URL,
            ReceiptHandle=message['ReceiptHandle'],
        )
        logger.info('✓ Processing complete and queue message deleted')
        return True
    except Exception as exc:
        logger.error('Error handling message: %s', exc)
        return False


def poll_queue() -> None:
    logger.info('Polling queue: %s', SQS_QUEUE_URL)
    while True:
        try:
            response = sqs_client.receive_message(
                QueueUrl=SQS_QUEUE_URL,
                MaxNumberOfMessages=1,
                WaitTimeSeconds=20,
                VisibilityTimeout=300,
            )

            messages = response.get('Messages', [])
            if not messages:
                continue

            for message in messages:
                handle_message(message)
        except Exception as exc:
            logger.error('Polling error: %s', exc)
            time.sleep(5)


if __name__ == '__main__':
    poll_queue()
