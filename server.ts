import 'dotenv/config'
import express from 'express';
import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg';
import cors from 'cors';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });
const app = express();
app.use(express.json());
app.use(cors());
//uses env info for the region
const s3 = new S3Client({ region: process.env.AWS_REGION });

// Helper to ensure param is a string
function getParam(req: express.Request, key: string): string {
  const value = req.params[key];
  return Array.isArray(value) ? value[0] : value;
}

// Create a new screening
app.post('/screening', async (req, res) => {
  const { startedAt } = req.body;
  const createdAt = startedAt ? new Date(startedAt) : new Date();

  try {
    const screening = await prisma.screening.create({
      data: {
        status: 'pending',
        createdAt,
      }
    });

    res.json({ success: true, screening, persisted: true });
  } catch (err) {
    console.error('Error creating screening:', err);

    const fallbackScreening = {
      id: randomUUID(),
      status: 'pending',
      createdAt,
      completedAt: null,
    };

    // Return a temporary ID so mobile upload flow can continue even if DB is unavailable.
    res.status(200).json({
      success: true,
      screening: fallbackScreening,
      persisted: false,
      warning: 'Database unavailable; returned fallback screening ID',
    });
  }
});

// Log a video session
app.post('/screening/video', async (req, res) => {
  try {
    //const screeningId = req.params.screeningId;
    console.log('Received body:', req.body);
    const { videoNumber, completedAt } = req.body;

    // Create a VideoSession linked to the screening
    const videoSession = await prisma.videoSession.create({
      data: {
        //screeningId: screeningId, // Replace with actual screeningId from request
        videoNumber: videoNumber,
        createdAt: completedAt ? new Date(completedAt) : new Date(),
      },
    });

    console.log(`Video session logged: Video ${videoNumber}`, videoSession);

    res.json({ success: true, videoSession });
  } catch (err) {
    console.error('Error logging video session:', err);
    res.status(500).json({ success: false, error: 'Failed to log video session' });
  }
});

// Complete a screening
app.post('/screening/:id/complete', async (req, res) => {
  /*
  const screeningId = req.params.id;
  const { completedAt } = req.body;
  console.log(`Screening ${screeningId} completed at ${completedAt}`);
  res.json({ success: true, });
  */
  const screeningId = getParam(req, 'id');
  const updated = await prisma.screening.update({
    where: { id: screeningId },
    data: { completedAt: new Date() }
  });
  res.json(updated);
});
//s3 url for upload  https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
app.post('/screening/upload-url', async (req, res) => {
  try {
    const { screeningId, videoNumber, contentType } = req.body;

    if (!screeningId || videoNumber === undefined || !contentType) {
      return res.status(400).json({
        success: false,
        error: 'screeningId, videoNumber, and contentType are required',
      });
    }

    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      return res.status(500).json({
        success: false,
        error: 'AWS_S3_BUCKET_NAME is not configured',
      });
    }

    const safeScreeningId = String(screeningId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeVideoNumber = String(videoNumber).replace(/[^a-zA-Z0-9_-]/g, '_');
    const extension = contentType === 'video/mp4' ? 'mp4' : 'webm';
    const objectKey = `screenings/${safeScreeningId}/video_${safeVideoNumber}_${Date.now()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 20 });

    res.json({
      success: true,
      uploadUrl,
      objectKey,
      bucketName,
      expiresInSeconds: 1200,
    });
  } catch (err) {
    console.error('Error creating upload URL:', err);
    res.status(500).json({ success: false, error: 'Failed to create upload URL' });
  }
});

// Receive results (CSV) from EC2 worker
app.post('/screening/:id/results', async (req, res) => {
  try {
    const screeningId = getParam(req, 'id');
    const { videoNumber, csvS3Key } = req.body;

    if (videoNumber === undefined || !csvS3Key) {
      return res.status(400).json({
        success: false,
        error: 'videoNumber and csvS3Key are required',
      });
    }

    console.log(`Results received: screening=${screeningId}, video=${videoNumber}, csvKey=${csvS3Key}`);

    // TODO: Store results in database (e.g., update Screening with risk_score)
    // For now, just log success
    return res.json({ success: true, message: 'Results received and stored' });
  } catch (err) {
    console.error('Error receiving results:', err);
    return res.status(500).json({ success: false, error: 'Failed to store results' });
  }
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});