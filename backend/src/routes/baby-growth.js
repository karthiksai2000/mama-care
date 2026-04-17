import express from 'express';
import BabyGrowth from '../models/BabyGrowth.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const items = await BabyGrowth.find({}).sort({ week: 1 });
  return res.json({ items });
});

router.get('/:week', requireAuth, async (req, res) => {
  const week = Number(req.params.week);
  if (!week) {
    return res.status(400).json({ message: 'Week is required.' });
  }

  const item = await BabyGrowth.findOne({ week });
  if (!item) {
    return res.status(404).json({ message: 'Week data not found.' });
  }

  return res.json({ item });
});

export default router;
