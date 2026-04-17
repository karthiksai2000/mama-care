import express from 'express';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import KickEvent from '../models/KickEvent.js';
import HealthTrend from '../models/HealthTrend.js';
import Reminder from '../models/Reminder.js';
import RiskAssessment from '../models/RiskAssessment.js';
import ChatMessage from '../models/ChatMessage.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const [
    latestRisk,
    trends,
    reminders,
    chatHistory,
    nextAppointment,
    kickCount,
  ] = await Promise.all([
    RiskAssessment.findOne({ userId: req.user.id }).sort({ createdAt: -1 }),
    HealthTrend.find({ userId: req.user.id }).sort({ week: 1 }),
    Reminder.find({ userId: req.user.id }).sort({ createdAt: -1 }),
    ChatMessage.find({ userId: req.user.id }).sort({ createdAt: 1 }).limit(30),
    Appointment.findOne({ userId: req.user.id, date: { $gte: new Date() } }).sort({ date: 1 }),
    KickEvent.countDocuments({
      userId: req.user.id,
      ts: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    }),
  ]);

  return res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      week: user.pregnancyWeek,
      risk: latestRisk?.level || null,
    },
    healthTrends: trends,
    reminders,
    chatHistory,
    stats: {
      nextAppointment,
      kickCount,
      waterIntake: null,
      waterGoal: null,
    },
  });
});

export default router;
