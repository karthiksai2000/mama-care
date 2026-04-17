import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Reminder from '../models/Reminder.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const createToken = (user) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }

  return jwt.sign({ email: user.email }, secret, { subject: user._id.toString(), expiresIn });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, pregnancyWeek, conditions } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      pregnancyWeek: pregnancyWeek || 1,
      conditions: conditions || [],
    });

    const defaultReminders = [
      'Take prenatal vitamins',
      'Drink at least 8 glasses of water',
      'Take a short walk or stretch',
    ];

    await Reminder.insertMany(
      defaultReminders.map((text) => ({
        userId: user._id,
        text,
        completed: false,
      }))
    );

    const token = createToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        pregnancyWeek: user.pregnancyWeek,
        conditions: user.conditions,
      },
    });
  } catch (error) {
    console.error('[MaMa Care] Register failed:', error);
    return res.status(500).json({ message: 'Registration failed.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = createToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        pregnancyWeek: user.pregnancyWeek,
        conditions: user.conditions,
      },
    });
  } catch (error) {
    console.error('[MaMa Care] Login failed:', error);
    return res.status(500).json({ message: 'Login failed.' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  return res.json({ user });
});

export default router;
