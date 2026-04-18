import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import reportRoutes from './routes/reports.js';
import mlRoutes from './routes/ml.js';
import reminderRoutes from './routes/reminders.js';
import weightRoutes from './routes/weight.js';
import kickRoutes from './routes/kicks.js';
import contractionRoutes from './routes/contractions.js';
import appointmentRoutes from './routes/appointments.js';
import babyGrowthRoutes from './routes/baby-growth.js';
import dietPlanRoutes from './routes/diet-plans.js';
import symptomRoutes from './routes/symptoms.js';
import riskRoutes from './routes/risk.js';
import chatRoutes from './routes/chat.js';
import healthTrackerRoutes from './routes/health-tracker.js';

const app = express();

const rawOrigins = process.env.CORS_ORIGIN || '*';
const allowedOrigins = rawOrigins
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = rawOrigins === '*' ? {} : { origin: allowedOrigins, credentials: true };

app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/kicks', kickRoutes);
app.use('/api/contractions', contractionRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/baby-growth', babyGrowthRoutes);
app.use('/api/diet-plans', dietPlanRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/health-tracker', healthTrackerRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
