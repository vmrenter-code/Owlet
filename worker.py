#!/usr/bin/env python3
import json
import logging
import os
import subprocess
import sys
import time
from pathlib import Path
from urllib.parse import unquote_plus

import boto3

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
OWLET_ROOT = os.getenv('OWLET_ROOT', str(Path.home() / 'OWLET'))
OWLET_EXPERIMENT_INFO = os.getenv('OWLET_EXPERIMENT_INFO')
OWLET_PYTHON = os.getenv('OWLET_PYTHON', sys.executable)


def process_video(local_path: str, screening_id: str, video_number: int) -> dict:
    """Run OWLET.py on video and return CSV results."""
    try:
        owlet_script = Path(OWLET_ROOT) / 'OWLET.py'
        if not owlet_script.exists():
            return {'success': False, 'error': f'OWLET.py not found at {owlet_script}'}

        logger.info('Running OWLET.py on screening=%s video=%s', screening_id, video_number)
        started_at = time.time()

        cmd = [
            OWLET_PYTHON,
            '-u',
            str(owlet_script),
            '--subject_video',
            local_path,
            '--cnn',
        ]

        if OWLET_EXPERIMENT_INFO and Path(OWLET_EXPERIMENT_INFO).exists():
            cmd.extend(['--experiment_info', OWLET_EXPERIMENT_INFO])

        logger.info('OWLET command: %s', ' '.join(cmd))
        proc = subprocess.Popen(
            cmd,
            cwd=OWLET_ROOT,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            env={**os.environ, 'PYTHONUNBUFFERED': '1'},
        )

        assert proc.stdout is not None
        last_output = time.time()
        try:
            for line in iter(proc.stdout.readline, ''):
                if not line:
                    break
                line = line.rstrip()
                if line:
                    last_output = time.time()
                    logger.info('OWLET: %s', line)

                # Emit a heartbeat if OWLET is still alive but quiet.
                if time.time() - last_output > 120:
                    logger.info('OWLET still running (no output for 2min) screening=%s video=%s', screening_id, video_number)
                    last_output = time.time()
        except Exception as e:
            logger.warning('Error reading OWLET output: %s', e)

        return_code = proc.wait(timeout=7200)  # 2-hour timeout
        if return_code != 0:
            return {'success': False, 'error': f'OWLET exit code {return_code}'}

        # Locate the freshest CSV produced by OWLET run.
        search_dirs = [Path(local_path).parent, Path(OWLET_ROOT), Path('/tmp')]
        csv_candidates = []
        for search_dir in search_dirs:
            if not search_dir.exists():
                continue
            for candidate in search_dir.rglob('*.csv'):
                if candidate.stat().st_mtime >= started_at - 2:
                    csv_candidates.append(candidate)

        if not csv_candidates:
            return {'success': False, 'error': 'OWLET completed but no CSV output found'}

        csv_path = str(max(csv_candidates, key=lambda p: p.stat().st_mtime))
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
        s3_key = f"results/{screening_id}/video_{video_number}/model_results.csv"
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

        # S3 sends test events when notification configuration is created/updated.
        if body.get('Event') == 's3:TestEvent':
            logger.info('Received s3:TestEvent, deleting message and skipping')
            sqs_client.delete_message(
                QueueUrl=SQS_QUEUE_URL,
                ReceiptHandle=message['ReceiptHandle'],
            )
            return True

        # Parse S3 Event Notification format from bucket event
        # Format: {Records: [{s3: {object: {key: "..."}}}]}
        s3_key = None
        screening_id = None
        video_number = None

        if 'Records' in body:
            for record in body['Records']:
                if record.get('eventSource') == 'aws:s3':
                    s3_key = unquote_plus(record['s3']['object']['key'])
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
