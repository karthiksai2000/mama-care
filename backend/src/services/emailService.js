import nodemailer from 'nodemailer';

const buildTransport = () => {
  const transportType = (process.env.EMAIL_TRANSPORT || 'console').toLowerCase();

  if (transportType === 'smtp') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return null;
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const from = process.env.EMAIL_FROM || 'no-reply@mamacare.local';
  const replyTo = process.env.EMAIL_REPLY_TO || undefined;
  const transportType = (process.env.EMAIL_TRANSPORT || 'console').toLowerCase();

  if (transportType !== 'smtp') {
    console.log('[MaMa Care] Email (console):', { to, subject, text });
    return { messageId: 'console', accepted: [to] };
  }

  const transporter = buildTransport();
  if (!transporter) {
    throw new Error('SMTP transport not configured');
  }

  const info = await transporter.sendMail({ from, to, subject, text, html, replyTo });
  return info;
};
