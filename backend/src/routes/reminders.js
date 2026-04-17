import express from 'express';
import { sendEmail } from '../services/emailService.js';

const router = express.Router();

router.post('/send', async (req, res) => {
  const { email, subject, message } = req.body || {};

  if (!email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Email, subject, and message are required.' });
  }

  try {
    await sendEmail({
      to: email,
      subject,
      text: message,
    });

    return res.json({ success: true, message: 'Reminder sent.' });
  } catch (error) {
    console.error('[MaMa Care] Reminder email failed:', error);
    return res.status(500).json({ success: false, message: 'Failed to send reminder.' });
  }
});

export default router;
