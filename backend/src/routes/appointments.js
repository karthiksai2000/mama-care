import express from 'express';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { sendEmail } from '../services/emailService.js';
import { buildAppointmentConfirmationEmail } from '../services/emailTemplates.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const appointments = await Appointment.find({ userId: req.user.id }).sort({ date: 1, time: 1 });
  return res.json({ appointments });
});

router.post('/', requireAuth, async (req, res) => {
  const { date, time, doctor, type, location, notes } = req.body;

  if (!date || !time || !doctor || !type) {
    return res.status(400).json({ message: 'Date, time, doctor, and type are required.' });
  }

  const appointment = await Appointment.create({
    userId: req.user.id,
    date: new Date(date),
    time,
    doctor,
    type,
    location: location || '',
    notes: notes || '',
  });

  try {
    const user = await User.findById(req.user.id).select('name email');
    if (user?.email) {
      const emailPayload = buildAppointmentConfirmationEmail({
        name: user.name,
        appointment,
      });
      const info = await sendEmail({
        to: user.email,
        subject: emailPayload.subject,
        text: emailPayload.text,
        html: emailPayload.html,
      });

      appointment.confirmationSentAt = new Date();
      await appointment.save();

      console.log('[MaMa Care] Appointment confirmation sent:', {
        to: user.email,
        messageId: info?.messageId,
        appointmentId: appointment._id,
      });
    }
  } catch (error) {
    console.error('[MaMa Care] Appointment confirmation failed:', error);
  }

  return res.status(201).json({ appointment });
});

router.post('/bulk', requireAuth, async (req, res) => {
  const appointments = Array.isArray(req.body?.appointments) ? req.body.appointments : [];
  if (!appointments.length) {
    return res.status(400).json({ message: 'appointments is required.' });
  }

  const docs = appointments
    .filter((appt) => appt?.date && appt?.time && appt?.doctor && appt?.type)
    .map((appt) => ({
      userId: req.user.id,
      date: new Date(appt.date),
      time: appt.time,
      doctor: appt.doctor,
      type: appt.type,
      location: appt.location || '',
      notes: appt.notes || '',
    }));

  if (!docs.length) {
    return res.status(400).json({ message: 'No valid appointments provided.' });
  }

  const inserted = await Appointment.insertMany(docs);
  return res.status(201).json({ appointments: inserted });
});

router.delete('/:id', requireAuth, async (req, res) => {
  const deleted = await Appointment.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) {
    return res.status(404).json({ message: 'Appointment not found.' });
  }
  return res.json({ success: true });
});

export default router;
