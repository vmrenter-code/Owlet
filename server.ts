import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from 'express';
import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg';
import cors from 'cors';
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount: unknown = null;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    console.error('Invalid FIREBASE_SERVICE_ACCOUNT JSON:', err);
  }
} else {
  const serviceAccountPath = path.resolve(__dirname, 'src', 'config', 'firebase-service-account.json');
  if (fs.existsSync(serviceAccountPath)) {
    try {
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    } catch (err) {
      console.error('Failed to read Firebase service account file:', err);
    }
  }
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });
const app = express();
app.use(express.json());
app.use(cors());
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
console.log('AWS config:', { key: process.env.AWS_ACCESS_KEY_ID, bucket: process.env.AWS_S3_BUCKET_NAME });

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
  const serviceAccountProjectId = (serviceAccount as { project_id?: string }).project_id ?? 'unknown';
  console.log('Firebase admin initialized with service account:', serviceAccountProjectId);
} else {
  try {
    admin.initializeApp();
    console.log('Firebase admin initialized with default application credentials');
  } catch (err) {
    console.error('Failed to initialize Firebase admin:', err);
  }
}

// Helper to ensure param is a string
function getParam(req: express.Request, key: string): string {
  const value = req.params[key];
  return Array.isArray(value) ? value[0] : value;
}

function buildHeartRateCsv(heartRateLog: Array<{ time: number; bpm: number }>): string {
  const rows = ['time_seconds,bpm'];
  for (const point of heartRateLog) {
    rows.push(`${point.time},${point.bpm}`);
  }
  return rows.join('\n');
}

function buildRrCsv(rrLog: number[]): string {
  const rows = ['sample_index,rr_ms'];
  rrLog.forEach((rr, index) => {
    rows.push(`${index + 1},${rr}`);
  });
  return rows.join('\n');
}

async function uploadTextCsvToS3(objectKey: string, csvText: string): Promise<void> {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured');
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: csvText,
      ContentType: 'text/csv',
    })
  );
}

function buildHeartRateSvg(
  heartRateLog: Array<{ time: number; bpm: number }>,
  rmssd: number | null
): string {
  if (!heartRateLog.length) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200">
      <rect width="600" height="200" fill="#12122a" rx="12"/>
      <text x="300" y="95" fill="#888" text-anchor="middle" font-size="16" font-family="sans-serif">No heart rate data recorded</text>
      <text x="300" y="118" fill="#555" text-anchor="middle" font-size="12" font-family="sans-serif">Polar H9 was not connected during this screening</text>
    </svg>`;
  }

  const W = 600, H = 300;
  const PL = 56, PR = 24, PT = 44, PB = 48;
  const chartW = W - PL - PR;
  const chartH = H - PT - PB;

  const bpms = heartRateLog.map(p => p.bpm);
  const times = heartRateLog.map(p => p.time);
  const rawMin = Math.min(...bpms);
  const rawMax = Math.max(...bpms);
  const minBpm = rawMin - 5;
  const maxBpm = rawMax + 5;
  const bpmRange = maxBpm - minBpm || 1;
  const maxTime = Math.max(...times) || 1;
  const avg = Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length);

  const toX = (t: number) => PL + (t / maxTime) * chartW;
  const toY = (b: number) => PT + chartH - ((b - minBpm) / bpmRange) * chartH;

  const polylinePoints = heartRateLog
    .map(p => `${toX(p.time).toFixed(1)},${toY(p.bpm).toFixed(1)}`)
    .join(' ');

  // Grid lines
  const step = Math.ceil((rawMax - rawMin + 10) / 4 / 5) * 5 || 10;
  const startVal = Math.floor(minBpm / step) * step;
  let gridSvg = '';
  for (let b = startVal; b <= maxBpm + step; b += step) {
    const y = toY(b);
    if (y < PT - 2 || y > PT + chartH + 2) continue;
    gridSvg += `<line x1="${PL}" y1="${y.toFixed(1)}" x2="${W - PR}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>`;
    gridSvg += `<text x="${PL - 8}" y="${(y + 4).toFixed(1)}" fill="#777" text-anchor="end" font-size="11" font-family="sans-serif">${b}</text>`;
  }

  // X-axis time labels
  let xSvg = '';
  for (let i = 0; i <= 4; i++) {
    const t = Math.round((i / 4) * maxTime);
    const x = toX(t).toFixed(1);
    xSvg += `<text x="${x}" y="${H - 10}" fill="#777" text-anchor="middle" font-size="11" font-family="sans-serif">${t}s</text>`;
  }

  const statsText = `Avg: ${avg} BPM  |  Min: ${rawMin} BPM  |  Max: ${rawMax} BPM${rmssd !== null ? `  |  RMSSD: ${rmssd}ms` : ''}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="#12122a" rx="12"/>
    <text x="${W / 2}" y="24" fill="#ffffff" text-anchor="middle" font-size="14" font-weight="bold" font-family="sans-serif">Heart Rate During Screening</text>
    ${gridSvg}
    <line x1="${PL}" y1="${PT}" x2="${PL}" y2="${PT + chartH}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <line x1="${PL}" y1="${PT + chartH}" x2="${W - PR}" y2="${PT + chartH}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <polyline points="${polylinePoints}" fill="none" stroke="#ff6b6b" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${xSvg}
    <text x="${W / 2}" y="${H - 28}" fill="#aaa" text-anchor="middle" font-size="11" font-family="sans-serif">${statsText}</text>
  </svg>`;
}

async function uploadSvgToS3(objectKey: string, svgText: string): Promise<void> {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!bucketName) throw new Error('AWS_S3_BUCKET_NAME is not configured');
  await s3.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    Body: svgText,
    ContentType: 'image/svg+xml',
  }));
}

async function uploadTextJsonToS3(objectKey: string, jsonText: string): Promise<void> {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured');
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: jsonText,
      ContentType: 'application/json',
    })
  );
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
    const { name, notifications } = req.body;

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
    return res.json({ success: true, user });
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
        medicalHistory: { set: Array.isArray(medicalHistory) ? medicalHistory.map(String) : [] },
        medicalNotes: medicalNotes ?? null,
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
        status: 'reviewed',
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

// Upload heart-rate CSV results for a completed screening
app.post('/screening/:id/heart-rate-csv', async (req, res) => {
  try {
    const screeningId = getParam(req, 'id');
    const { videoNumber, heartRateLog, rrLog, rmssd, completedAt } = req.body;

    if (videoNumber === undefined || !Array.isArray(heartRateLog)) {
      return res.status(400).json({
        success: false,
        error: 'videoNumber and heartRateLog are required',
      });
    }

    const safeScreeningId = String(screeningId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeVideoNumber = String(videoNumber).replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = completedAt ? new Date(completedAt).getTime() : Date.now();

    const heartRateCsv = buildHeartRateCsv(heartRateLog);
    const rrCsv = buildRrCsv(Array.isArray(rrLog) ? rrLog : []);
    const rmssdValue = typeof rmssd === 'number' ? rmssd : null;

    const videoPrefix = `results/${safeScreeningId}/video_${safeVideoNumber}`;
    const heartRateKey = `${videoPrefix}/heart_rate_${timestamp}.csv`;
    const rrKey = `${videoPrefix}/rr_intervals_${timestamp}.csv`;
    const hrvKey = `${videoPrefix}/hrv_${timestamp}.json`;
    const chartKey = `${videoPrefix}/heart_rate_chart_${timestamp}.svg`;

    const svgContent = buildHeartRateSvg(heartRateLog, rmssdValue);

    await Promise.all([
      uploadTextCsvToS3(heartRateKey, heartRateCsv),
      uploadTextCsvToS3(rrKey, rrCsv),
      uploadTextJsonToS3(
        hrvKey,
        JSON.stringify({
          screeningId: safeScreeningId,
          videoNumber: Number(videoNumber),
          rmssd: rmssdValue,
          completedAt: completedAt ?? null,
          timestamp,
        }, null, 2)
      ),
      uploadSvgToS3(chartKey, svgContent),
    ]);

    console.log(`Heart rate data uploaded for screening=${screeningId}, video=${videoNumber}`);
    return res.json({
      success: true,
      heartRateKey,
      rrKey,
      hrvKey,
      chartKey,
      rmssd: rmssdValue,
    });
  } catch (err: any) {
    console.error('Error uploading heart-rate CSVs:', err?.Code ?? err?.message ?? err);
    return res.status(500).json({ success: false, error: 'Failed to upload heart-rate CSVs' });
  }
});

// Fetch stored heart-rate data from S3 for a past screening
app.get('/screening/:id/heart-rate', async (req, res) => {
  try {
    const screeningId = getParam(req, 'id');
    const safeId = String(screeningId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) return res.status(500).json({ success: false, error: 'S3 not configured' });

    // List all objects for this screening
    const listed = await s3.send(new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: `results/${safeId}/`,
    }));
    const objects = listed.Contents ?? [];

    const hrKey = objects.find(o => o.Key?.match(/heart_rate_\d+\.csv$/))?.Key;
    const hrvKey = objects.find(o => o.Key?.match(/hrv_\d+\.json$/))?.Key;

    if (!hrKey) {
      return res.json({ success: true, data: [], rmssd: null });
    }

    // Download and parse the heart rate CSV
    const csvObj = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: hrKey }));
    const csvText = await (csvObj.Body as any).transformToString();
    const lines = csvText.split('\n').filter(Boolean);
    const data: { time: number; bpm: number }[] = [];
    for (const line of lines.slice(1)) {
      const [t, b] = line.split(',');
      const time = parseFloat(t);
      const bpm = parseFloat(b);
      if (!isNaN(time) && !isNaN(bpm)) data.push({ time, bpm });
    }

    // Pull RMSSD from the HRV JSON if available
    let rmssd: number | null = null;
    if (hrvKey) {
      const hrvObj = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: hrvKey }));
      const hrvText = await (hrvObj.Body as any).transformToString();
      rmssd = JSON.parse(hrvText)?.rmssd ?? null;
    }

    return res.json({ success: true, data, rmssd });
  } catch (err: any) {
    console.error('Error fetching heart rate data:', err?.Code ?? err?.message ?? err);
    return res.status(500).json({ success: false, error: 'Failed to fetch heart rate data' });
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