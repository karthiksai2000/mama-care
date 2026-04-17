import express from 'express';
import KickEvent from '../models/KickEvent.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const kicks = await KickEvent.find({ userId: req.user.id }).sort({ ts: 1 });
  return res.json({ kicks });
});

router.post('/', requireAuth, async (req, res) => {
  const ts = req.body?.ts ? new Date(req.body.ts) : new Date();
  const kick = await KickEvent.create({ userId: req.user.id, ts });
  return res.status(201).json({ kick });
});

router.post('/bulk', requireAuth, async (req, res) => {
  const kicks = Array.isArray(req.body?.kicks) ? req.body.kicks : [];
  if (!kicks.length) {
    return res.status(400).json({ message: 'kicks is required.' });
  }

  const docs = kicks
    .filter((kick) => kick?.ts)
    .map((kick) => ({
      userId: req.user.id,
      ts: new Date(kick.ts),
    }));

  if (!docs.length) {
    return res.status(400).json({ message: 'No valid kicks provided.' });
  }

  const inserted = await KickEvent.insertMany(docs);
  return res.status(201).json({ kicks: inserted });
});

router.delete('/today', requireAuth, async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  await KickEvent.deleteMany({
    userId: req.user.id,
    ts: { $gte: start, $lte: end },
  });

  return res.json({ success: true });
});

router.delete('/:id', requireAuth, async (req, res) => {
  const deleted = await KickEvent.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) {
    return res.status(404).json({ message: 'Kick not found.' });
  }
  return res.json({ success: true });
});

export default router;
