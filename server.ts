import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Helper to ensure param is a string
function getParam(req: express.Request, key: string): string {
  const value = req.params[key];
  return Array.isArray(value) ? value[0] : value;
}

// Create a new screening
app.post('/screening', async (req, res) => {
  console.log('Screening started at:', req.body.startedAt);
  res.json({ success: true });
});

// Log a video session
app.post('/screening/:id/video', async (req, res) => {
  const screeningId = req.params.id;
  const { videoNumber, completedAt } = req.body;
  console.log(`Video ${screeningId}:${videoNumber} completed at ${completedAt}`);
  res.json({ success: true });
});

// Complete a screening
app.post('/screening/:id/complete', async (req, res) => {
  const screeningId = req.params.id;
  const { completedAt } = req.body;
  console.log(`Screening ${screeningId} completed at ${completedAt}`);
  res.json({ success: true, });
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});