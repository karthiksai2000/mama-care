import cron from 'node-cron';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import HealthTrend from '../models/HealthTrend.js';
import Reminder from '../models/Reminder.js';
import { sendEmail } from '../services/emailService.js';
import {
  buildAppointmentTimeReminderEmail,
  buildDailyWellnessEmail,
  buildWeeklySummaryEmail,
} from '../services/emailTemplates.js';

const isEnabled = () => String(process.env.EMAIL_SCHEDULER_ENABLED || 'true').toLowerCase() === 'true';
const rawTimezone = process.env.EMAIL_SCHEDULER_TZ || 'UTC';
const timezone = rawTimezone.toLowerCase() === 'kolkota' ? 'Asia/Kolkata' : rawTimezone;
const dailyCron = process.env.EMAIL_DAILY_CRON || '0 8 * * *';
const weeklyCron = process.env.EMAIL_WEEKLY_CRON || '0 9 * * 1';
const appointmentCron = process.env.EMAIL_APPOINTMENT_CRON || '*/5 * * * *';

const WELLNESS_TIPS = [
  'Drink a glass of water and take 5 slow breaths.',
  'Try a short walk or gentle stretch to ease tension.',
  'Eat a colorful snack with protein and fiber.',
  'Take 10 minutes to rest and put your feet up.',
  'Write down one thing you are grateful for today.',
  'If you feel dizzy or unwell, pause and hydrate.',
];

const pickDailyTip = (date) => WELLNESS_TIPS[date.getDay() % WELLNESS_TIPS.length];

const buildAppointmentDateTime = (appointment) => {
  const base = new Date(appointment.date);
  if (!appointment.time) return base;

  const [hours, minutes] = appointment.time.split(':').map((value) => Number(value));
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return base;

  const combined = new Date(base);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
};

const withLog = (label, fn) => async () => {
  try {
    await fn();
    console.log(`[MaMa Care] ${label} job completed`);
  } catch (error) {
    console.error(`[MaMa Care] ${label} job failed:`, error);
  }
};

const sendAppointmentReminders = async () => {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const appointments = await Appointment.find({
    date: { $gte: startOfDay, $lte: endOfDay },
  }).populate('userId');

  for (const appointment of appointments) {
    const user = appointment.userId;
    if (!user?.email) continue;

    const appointmentDateTime = buildAppointmentDateTime(appointment);
    const minutesUntil = (appointmentDateTime.getTime() - now.getTime()) / 60000;

    if (
      minutesUntil <= 30 &&
      minutesUntil > 25 &&
      !appointment.reminder30SentAt
    ) {
      const email = buildAppointmentTimeReminderEmail({
        name: user.name,
        appointment,
        minutes: 30,
      });
      await sendEmail({ to: user.email, subject: email.subject, text: email.text, html: email.html });
      appointment.reminder30SentAt = new Date();
      await appointment.save();
      continue;
    }

    if (
      minutesUntil <= 5 &&
      minutesUntil >= 0 &&
      !appointment.reminderAtSentAt
    ) {
      const email = buildAppointmentTimeReminderEmail({
        name: user.name,
        appointment,
        minutes: 0,
      });
      await sendEmail({ to: user.email, subject: email.subject, text: email.text, html: email.html });
      appointment.reminderAtSentAt = new Date();
      await appointment.save();
      continue;
    }

  }
};

const sendDailyWellnessTips = async () => {
  const users = await User.find({}).select('name email');
  const tip = pickDailyTip(new Date());

  for (const user of users) {
    if (!user.email) continue;

    const email = buildDailyWellnessEmail({ name: user.name, tip });
    await sendEmail({ to: user.email, subject: email.subject, text: email.text, html: email.html });
  }
};

const sendWeeklySummaries = async () => {
  const users = await User.find({}).select('name email pregnancyWeek');

  for (const user of users) {
    if (!user.email) continue;

    const [latestTrend, reminderCount] = await Promise.all([
      HealthTrend.findOne({ userId: user._id }).sort({ week: -1 }),
      Reminder.countDocuments({ userId: user._id, completed: false }),
    ]);

    const insights = [
      `Current pregnancy week: ${user.pregnancyWeek || '—'}`,
      latestTrend?.hemoglobin ? `Latest hemoglobin: ${latestTrend.hemoglobin} g/dL` : 'No recent hemoglobin updates yet.',
      `Active reminders: ${reminderCount}`,
      'Remember to hydrate, rest, and reach out if anything feels off.',
    ];

    const email = buildWeeklySummaryEmail({
      name: user.name,
      week: user.pregnancyWeek,
      insights,
    });

    await sendEmail({ to: user.email, subject: email.subject, text: email.text, html: email.html });
  }
};

export const startEmailScheduler = () => {
  if (!isEnabled()) {
    console.log('[MaMa Care] Email scheduler disabled');
    return;
  }

  cron.schedule(dailyCron, withLog('Daily wellness tip', sendDailyWellnessTips), { timezone });
  cron.schedule(appointmentCron, withLog('Appointment reminders', sendAppointmentReminders), { timezone });
  cron.schedule(weeklyCron, withLog('Weekly summary', sendWeeklySummaries), { timezone });

  console.log('[MaMa Care] Email scheduler started');
};