import express from 'express';
import Contraction from '../models/Contraction.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const contractions = await Contraction.find({ userId: req.user.id }).sort({ start: -1 });
  return res.json({ contractions });
});

router.post('/', requireAuth, async (req, res) => {
  const { start, duration } = req.body;

  if (!start || typeof duration !== 'number') {
    return res.status(400).json({ message: 'Start time and duration are required.' });
  }

  const contraction = await Contraction.create({
    userId: req.user.id,
    start: new Date(start),
    duration,
  });

  return res.status(201).json({ contraction });
});

router.post('/bulk', requireAuth, async (req, res) => {
  const contractions = Array.isArray(req.body?.contractions) ? req.body.contractions : [];
  if (!contractions.length) {
    return res.status(400).json({ message: 'contractions is required.' });
  }

  const docs = contractions
    .filter((contraction) => contraction?.start && typeof contraction?.duration === 'number')
    .map((contraction) => ({
      userId: req.user.id,
      start: new Date(contraction.start),
      duration: contraction.duration,
    }));

  if (!docs.length) {
    return res.status(400).json({ message: 'No valid contractions provided.' });
  }

  const inserted = await Contraction.insertMany(docs);
  return res.status(201).json({ contractions: inserted });
});

router.delete('/', requireAuth, async (req, res) => {
  await Contraction.deleteMany({ userId: req.user.id });
  return res.json({ success: true });
});

router.delete('/:id', requireAuth, async (req, res) => {
  const deleted = await Contraction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) {
    return res.status(404).json({ message: 'Contraction not found.' });
  }
  return res.json({ success: true });
});

export default router;
