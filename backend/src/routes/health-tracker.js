import express from 'express';
import HealthEntry from '../models/HealthEntry.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/entries', requireAuth, async (req, res) => {
  const limit = Number(req.query.limit || 50);
  const entries = await HealthEntry.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(limit);

  return res.json({ entries });
});

router.post('/entries', requireAuth, async (req, res) => {
  const text = req.body?.text?.trim();
  if (!text) {
    return res.status(400).json({ message: 'Entry text is required.' });
  }

  const entry = await HealthEntry.create({
    userId: req.user.id,
    text,
    hydration: req.body?.hydration,
    sleep: req.body?.sleep,
    mood: req.body?.mood,
  });

  return res.status(201).json({ entry });
});

export default router;
