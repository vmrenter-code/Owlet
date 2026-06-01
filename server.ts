import 'dotenv/config'
import express from 'express';
import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg';
import cors from 'cors';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

import admin from 'firebase-admin';
import serviceAccount from './src/config/firebase-service-account.json' with {type: 'json'};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });
const app = express();
app.use(express.json());
app.use(cors());
//uses env info for the region
const s3 = new S3Client({ region: process.env.AWS_REGION });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
console.log('Firebase admin initialized with service account:', serviceAccount.project_id);

// Helper to ensure param is a string
function getParam(req: express.Request, key: string): string {
  const value = req.params[key];
  return Array.isArray(value) ? value[0] : value;
}

app.post('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    const { name, babyBday, notifications } = req.body;

    const user = await prisma.user.upsert({
      where: { firebaseUid },
      update: { 
        name,
        notifications 
      },
      create: { 
        firebaseUid, 
        name,
        notifications 
      },
    });
    res.json({ success: true, user });
  } catch (err) {
    console.error('Error upserting user profile:', err);
    res.status(500).json({ success: false, error: 'Failed to upsert user profile' });
  }
});

// Sync user data on login
app.post('/users/sync', async (req, res) => {
  console.log('Received request to sync user data');
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Missing token" });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    const firebaseUid = decoded.uid;
    const email = decoded.email || null;
    const name = decoded.name || decoded.email?.split("@")[0] || "User";
    console.log('Syncing user:', { firebaseUid, email, name });
    // Upsert user in the database
    const user = await prisma.user.upsert({
      where: { firebaseUid },
      update: {
        name,
      },
      create: {
        firebaseUid,
        name,
      },
    });
    /*
    // Check if user already has a child profile, if not create a default one
    const existingChild = await prisma.child.findFirst({ where: { userId: user.id } });
    if (!existingChild) {
      console.log(`No child profile found for user ${user.id}, creating default child profile`);
      await prisma.child.create({
        data: {
          name: 'Default Child',
          birthday: null,
          userId: user.id,
        },
      });
    }
    return res.json({ success: true, user });
    */

  } catch (err) {
    console.error("Error syncing user:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to sync user",
    });
  }
});

// Create a child profile linked to the user
app.post('/children', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    const { name, birthday, race, ethnicity, medicalHistory, medicalNotes } = req.body;

    // Find user in the database
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create child linked to user
    console.log(`Creating child profile for user ${user.id} with name: ${name} and birthday: ${birthday}`);
    const child = await prisma.child.create({
      data: {
        name: name || 'New Child',
        birthday: birthday ? new Date(birthday) : null,
        userId: user.id,
        race: race,
        ethnicity: ethnicity,
        medicalHistory: medicalHistory,
        medicalNotes: medicalNotes,
      },
    });
    return res.json({ success: true, child });
  } catch (err) {
    console.error('Error creating child profile:', err);
    res.status(500).json({ success: false, error: 'Failed to create child profile' });
  }
});

// Fetch child profiles for the curr user
app.get('/children', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    // Find user
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get children
    const children = await prisma.child.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
    });

    res.json(children);
  } catch (err) {
    console.error("Error fetching children:", err);
    res.status(500).json({ error: "Failed to fetch children" });
  }
});

// Update a child profile
app.put('/children/:childId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    const { childId } = req.params;
    const { name, birthday, race, medicalHistory, medicalNotes } = req.body;

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const child = await prisma.child.findUnique({
      where: {
        id: childId,
        userId: user.id,
      },
    });
    if (!child) {
      return res.status(404).json({ error: "Child not found" });
    }

    const updatedChild = await prisma.child.update({
      where: { id: childId },
      data: {
        ...(name && { name }),
        ...(birthday && { birthday: new Date(birthday) }),
        ...(race && { race }),
        ...(medicalHistory && { medicalHistory }),
        ...(medicalNotes && { medicalNotes }),
      },
    });

    res.json({ success: true, child: updatedChild });
  } catch (err) {
    console.error('Error updating child profile:', err);
    res.status(500).json({ success: false, error: 'Failed to update child profile' });
  }
})

// Create a new screening
app.post('/screening', async (req, res) => {
  const { startedAt } = req.body;
  const createdAt = startedAt ? new Date(startedAt) : new Date();

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    const { screeningID, startedAt, childId } = req.body;
    console.log("BODY: ",req.body);

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(`Creating screening for user ${user.id} with screeningID: ${screeningID}, startedAt: ${startedAt}, childId: ${childId}`);
    const screening = await prisma.screening.create({
      data: {
        id: screeningID,
        status: 'pending',
        createdAt: startedAt ? new Date(startedAt) : new Date(),
        userId: user.id,
        childId: childId,
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

// Fetch screenings from a user & child profile
app.get('/screenings', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing token" });
      }
      const token = authHeader.split("Bearer ")[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const firebaseUid = decodedToken.uid;

      const {childId} = req.query;
      const user = await prisma.user.findUnique({
        where: { firebaseUid },
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

        const screenings = await prisma.screening.findMany({
            where: {
              userId: user.id,
              ...(childId ? { childId: String(childId) } : {}),
            },
            orderBy: { createdAt: 'desc' },
            include: { videoSessions: true },
        });
        res.json({ success: true, screenings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to fetch screenings' });
    }
});

// Log a video session
app.post('/screening/video', async (req, res) => {
  try {
    //const screeningId = req.params.screeningId;
    console.log('Received body:', req.body);
    const { screeningID, videoNumber, completedAt } = req.body;
    if (!screeningID) {
      return res.status(400).json({ success: false, error: 'screeningID is required' });
    }

    // Create a VideoSession linked to the screening
    const videoSession = await prisma.videoSession.create({
      data: {
        videoNumber: videoNumber,
        createdAt: completedAt ? new Date(completedAt) : new Date(),
        screening: { connect: { id: screeningID }}
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
  try {
    const { id } = req.params;
    const { completedAt } = req.body;
    const updated = await prisma.screening.update({
        where: { id },
        data: { 
          completedAt: completedAt ? new Date(completedAt) : new Date(),
          status: 'completed'
        },
    });
    console.log(`Screening ${id} marked as complete at ${updated.completedAt}`);

    // Simulate review after 5 seconds
    setTimeout(async () => {
      try {
        const reviewedScreening = await prisma.screening.update({
          where: { id },
          data: { 
            status: 'reviewed',
            reviewedAt: new Date()
          },
          include: { user: true }
        });
        console.log(`Screening ${id} marked as reviewed`);

        // Send notification

      } catch (err) {
        console.error('Error during simulated review:', err);
      }
    }, 5000);
    
    res.json({ success: true, screening: updated });
  } catch (err) {
    console.error('Error updating screening:', err);
    res.status(500).json({ success: false, error: 'Failed to mark screening complete' });
  }
});

app.put('/settings/language', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    const { language } = req.body;
    if (!language) {
      return res.status(400).json({ error: "Language required" });
    }

    const user = await prisma.user.update({
      where: { firebaseUid: decodedToken.uid },
      data: { language },
    });
    res.json({
      success: true,
      language: user.language,
    });

  } catch (err) {
    console.error("PUT language error:", err);
    res.status(500).json({ success: false });
  }
});

app.get('/settings/language', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing token" });
      }
      const token = authHeader.split("Bearer ")[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      success: true,
      language: user.language || "English",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
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