import 'dotenv/config'
import express from 'express';
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg';
import cors from 'cors';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });
const app = express();
app.use(express.json());
app.use(cors());

// Helper to ensure param is a string
function getParam(req: express.Request, key: string): string {
  const value = req.params[key];
  return Array.isArray(value) ? value[0] : value;
}

// Create a new screening
app.post('/screening', async (req, res) => {
  try {
    const { startedAt } = req.body;

    const screening = await prisma.screening.create({
      data: {
        status: 'pending',
        createdAt: startedAt ? new Date(startedAt) : new Date(),
      }
    });

    res.json({ success: true, screening });
  } catch (err) {
    console.error('Error creating screening:', err);
    res.status(500).json({ success: false, error: 'Failed to create screening' });
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

app.listen(4000, () => {
  console.log('Server running on port 4000');
});