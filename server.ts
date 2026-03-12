import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Helper to ensure param is a string
function getParam(req: express.Request, key: string): string {
  const value = req.params[key];
  return Array.isArray(value) ? value[0] : value;
}

// Create a new screening
app.post('/screening', async (req: express.Request, res: express.Response) => {
  try {
    const screening = await prisma.screening.create({ data: {} });
    res.json(screening);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create screening' });
  }
});

// Log a video session
app.post('/screening/:id/video', async (req: express.Request, res: express.Response) => {
  const id = getParam(req, 'id'); // always string
  try {
    const videoSession = await prisma.videoSession.create({
      data: { screeningId: id },
    });
    res.json(videoSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log video session' });
  }
});

// Complete a screening
app.post('/screening/:id/complete', async (req: express.Request, res: express.Response) => {
  const id = getParam(req, 'id'); // always string
  try {
    const screening = await prisma.screening.update({
      where: { id },
      data: { status: 'completed', completedAt: new Date() },
    });
    res.json(screening);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to complete screening' });
  }
});

app.listen(4000, '0.0.0.0', () =>
  console.log('Server running on http://0.0.0.0:4000')
);