import 'dotenv/config'
import express from 'express';
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg';
import cors from 'cors';
import admin from 'firebase-admin';
import serviceAccount from './src/config/firebase-service-account.json' with {type: 'json'};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });
const app = express();
app.use(express.json());
app.use(cors());

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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    const { name, birthday } = req.body;

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
      },
    });
    return res.json({ success: true, child });
  } catch (err) {
    console.error('Error creating child profile:', err);
    res.status(500).json({ success: false, error: 'Failed to create child profile' });
  }
});

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

// Create a new screening
app.post('/screening', async (req, res) => {
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

    res.json({ success: true, screening });
  } catch (err) {
    console.error('Error creating screening:', err);
    res.status(500).json({ success: false, error: 'Failed to create screening' });
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
        data: { completedAt: completedAt ? new Date(completedAt) : new Date() },
    });

    res.json({ success: true, screening: updated });
  } catch (err) {
    console.error('Error updating screening:', err);
    res.status(500).json({ success: false, error: 'Failed to mark screening complete' });
  }
});

app.put('/settings', async (req, res) => {
  const { notifications, language, accessibility } = req.body;

  const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing token" });
      }
      const token = authHeader.split("Bearer ")[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

  const user = await prisma.user.update({
    where: { firebaseUid: decodedToken.uid },
    data: {
      notifications,
      language,
      accessibility,
    },
  });

  res.json({ success: true, user });
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

app.listen(4000, () => {
  console.log('Server running on port 4000');
});