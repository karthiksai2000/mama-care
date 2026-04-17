import express from 'express';
import DietPlan from '../models/DietPlan.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const trimester = Number(req.query.trimester);
  const week = Number(req.query.week);

  if (!trimester || !week) {
    return res.status(400).json({ message: 'Trimester and week are required.' });
  }

  const plan = await DietPlan.findOne({ trimester, week });
  if (!plan) {
    return res.status(404).json({ message: 'Diet plan not found.' });
  }

  return res.json({ plan });
});

export default router;
