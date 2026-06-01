import 'dotenv/config'
import express from 'express';
import { randomUUID } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg';
import cors from 'cors';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

import admin from 'firebase-admin';

function loadFirebaseServiceAccount(): admin.ServiceAccount {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) as admin.ServiceAccount;
  }

  const candidates = [
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    resolve('src/config/firebase-service-account.json'),
    resolve('firebase-service-account.json'),
  ].filter((p): p is string => !!p);

  for (const filePath of candidates) {
    if (existsSync(filePath)) {
      return JSON.parse(readFileSync(filePath, 'utf8')) as admin.ServiceAccount;
    }
  }

  throw new Error(
    'Firebase Admin credentials missing. Add src/config/firebase-service-account.json or set FIREBASE_SERVICE_ACCOUNT_PATH / FIREBASE_SERVICE_ACCOUNT_JSON in .env',
  );
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing from .env — required for the API server.');
}

const serviceAccount = loadFirebaseServiceAccount();

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
  credential: admin.credential.cert(serviceAccount),
});
console.log('Firebase admin initialized for project:', serviceAccount.project_id);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Helper to ensure param is a string
function getParam(req: express.Request, key: string): string {
  const value = req.params[key];
  return Array.isArray(value) ? value[0] : value;
}

type DbChild = {
  id: string;
  userId: string;
  name: string | null;
  birthday: Date | null;
  race: string | null;
  ethnicity: string | null;
  gender: string | null;
  avatarKey: string | null;
  medicalHistory: string | null;
  medicalNotes: string | null;
  createdAt: Date;
};

function serializeChild(child: DbChild) {
  return {
    id: child.id,
    userId: child.userId,
    name: child.name,
    birthday: child.birthday ? child.birthday.toISOString().slice(0, 10) : null,
    race: child.race,
    ethnicity: child.ethnicity,
    gender: child.gender,
    avatarKey: child.avatarKey,
    medicalHistory: child.medicalHistory,
    medicalNotes: child.medicalNotes,
    createdAt: child.createdAt.toISOString(),
  };
}

async function resolveUserFromRequest(req: express.Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split('Bearer ')[1];
  const decoded = await admin.auth().verifyIdToken(token);
  const displayName = decoded.name || decoded.email?.split('@')[0] || 'User';
  const user = await prisma.user.upsert({
    where: { firebaseUid: decoded.uid },
    update: { name: displayName },
    create: { firebaseUid: decoded.uid, name: displayName },
  });
  return user;
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
        babyBday: babyBday ? new Date(babyBday) : null, 
        notifications 
      },
      create: { 
        firebaseUid, 
        name, 
        babyBday: babyBday ? new Date(babyBday) : null, 
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

    const children = await prisma.child.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
    });

    const serialized = children.map(serializeChild);

    return res.json({
      success: true,
      user,
      children: serialized,
      defaultChild: serialized[0] ?? null,
    });
  } catch (err) {
    console.error("Error syncing user:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to sync user",
    });
  }
});

app.post('/children', async (req, res) => {
  try {
    const user = await resolveUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Missing token' });
    }
    const { name, birthday, race, ethnicity, gender, medicalHistory, medicalNotes } = req.body;

    let parsedBirthday: Date | null = null;
    if (birthday) {
      const asDate = new Date(birthday);
      parsedBirthday = Number.isNaN(asDate.getTime()) ? null : asDate;
    }

    const historyValue = Array.isArray(medicalHistory)
      ? JSON.stringify(medicalHistory)
      : typeof medicalHistory === 'string'
        ? medicalHistory
        : null;

    console.log(`Creating child profile for user ${user.id} with name: ${name}`);
    const child = await prisma.child.create({
      data: {
        name: name || 'New Child',
        birthday: parsedBirthday,
        race: race ?? null,
        ethnicity: ethnicity ?? null,
        gender: gender ?? null,
        medicalHistory: historyValue,
        medicalNotes: medicalNotes ?? null,
        userId: user.id,
      },
    });
    return res.json({ success: true, child: serializeChild(child) });
  } catch (err) {
    console.error('Error creating child profile:', err);
    res.status(500).json({ success: false, error: 'Failed to create child profile' });
  }
});

app.get('/children', async (req, res) => {
  try {
    const user = await resolveUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Missing token' });
    }

    const children = await prisma.child.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
    });

    res.json(children.map(serializeChild));
  } catch (err) {
    console.error("Error fetching children:", err);
    res.status(500).json({ error: "Failed to fetch children" });
  }
});

app.patch('/children/:id', async (req, res) => {
  try {
    const user = await resolveUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Missing token' });
    }
    const { id } = req.params;
    const {
      name,
      birthday,
      race,
      ethnicity,
      gender,
      avatarKey,
      medicalHistory,
      medicalNotes,
    } = req.body;

    const existing = await prisma.child.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Child not found' });
    }

    let parsedBirthday: Date | null | undefined = undefined;
    if (birthday !== undefined) {
      if (birthday === null || birthday === '') {
        parsedBirthday = null;
      } else {
        const asDate = new Date(birthday);
        parsedBirthday = Number.isNaN(asDate.getTime()) ? null : asDate;
      }
    }

    const historyValue =
      medicalHistory === undefined
        ? undefined
        : Array.isArray(medicalHistory)
          ? JSON.stringify(medicalHistory)
          : typeof medicalHistory === 'string'
            ? medicalHistory
            : null;

    const child = await prisma.child.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(parsedBirthday !== undefined ? { birthday: parsedBirthday } : {}),
        ...(race !== undefined ? { race } : {}),
        ...(ethnicity !== undefined ? { ethnicity } : {}),
        ...(gender !== undefined ? { gender } : {}),
        ...(avatarKey !== undefined ? { avatarKey } : {}),
        ...(historyValue !== undefined ? { medicalHistory: historyValue } : {}),
        ...(medicalNotes !== undefined ? { medicalNotes } : {}),
      },
    });

    return res.json({ success: true, child: serializeChild(child) });
  } catch (err) {
    console.error('Error updating child:', err);
    res.status(500).json({ success: false, error: 'Failed to update child' });
  }
});

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

// GET /screenings
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