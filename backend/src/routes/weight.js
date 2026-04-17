import express from 'express';
import WeightEntry from '../models/WeightEntry.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const entries = await WeightEntry.find({ userId: req.user.id }).sort({ date: 1 });
  return res.json({ entries });
});

router.post('/', requireAuth, async (req, res) => {
  const { date, weight } = req.body;

  if (!date || typeof weight !== 'number') {
    return res.status(400).json({ message: 'Date and weight are required.' });
  }

  const entry = await WeightEntry.create({
    userId: req.user.id,
    date: new Date(date),
    weight,
  });

  return res.status(201).json({ entry });
});

router.post('/bulk', requireAuth, async (req, res) => {
  const entries = Array.isArray(req.body?.entries) ? req.body.entries : [];
  if (!entries.length) {
    return res.status(400).json({ message: 'entries is required.' });
  }

  const docs = entries
    .filter((entry) => entry?.date && typeof entry?.weight === 'number')
    .map((entry) => ({
      userId: req.user.id,
      date: new Date(entry.date),
      weight: entry.weight,
    }));

  if (!docs.length) {
    return res.status(400).json({ message: 'No valid entries provided.' });
  }

  const inserted = await WeightEntry.insertMany(docs);
  return res.status(201).json({ entries: inserted });
});

router.delete('/:id', requireAuth, async (req, res) => {
  const deleted = await WeightEntry.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) {
    return res.status(404).json({ message: 'Entry not found.' });
  }
  return res.json({ success: true });
});

export default router;
