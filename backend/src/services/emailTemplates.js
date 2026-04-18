const baseStyles = {
  body: 'margin:0;padding:0;background:#f7f0f6;font-family:Inter, Arial, sans-serif;color:#2d1b2f;',
  card: 'max-width:640px;margin:24px auto;background:#ffffff;border-radius:20px;box-shadow:0 18px 60px rgba(45,27,47,0.12);overflow:hidden;',
  header: 'padding:28px 32px;background:linear-gradient(135deg,#d67aa5,#b492e6);color:#ffffff;',
  title: 'margin:0;font-family:"Instrument Serif", serif;font-size:28px;letter-spacing:-0.02em;',
  content: 'padding:28px 32px;font-size:15px;line-height:1.6;',
  chip: 'display:inline-block;padding:6px 12px;border-radius:999px;background:#f3e6f2;color:#9a5a7d;font-size:12px;font-weight:600;margin-bottom:12px;',
  button: 'display:inline-block;padding:12px 20px;border-radius:999px;background:linear-gradient(135deg,#d67aa5,#b492e6);color:#ffffff;text-decoration:none;font-weight:600;',
  footer: 'padding:18px 32px;font-size:12px;color:#7a6678;background:#f7f0f6;text-align:center;',
  list: 'margin:12px 0;padding-left:18px;color:#4b3a4e;',
};

const wrapHtml = (title, bodyHtml) => `
  <div style="${baseStyles.body}">
    <div style="${baseStyles.card}">
      <div style="${baseStyles.header}">
        <p style="margin:0;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;opacity:0.8;">MaMa Care</p>
        <h1 style="${baseStyles.title}">${title}</h1>
      </div>
      <div style="${baseStyles.content}">
        ${bodyHtml}
      </div>
      <div style="${baseStyles.footer}">You are receiving this because you signed up for MaMa Care. If you need help, reply to this email.</div>
    </div>
  </div>
`;

export const buildWelcomeEmail = ({ name }) => {
  const content = `
    <span style="${baseStyles.chip}">Welcome to your journey</span>
    <p>Hi ${name || 'there'},</p>
    <p>We are honored to support you with calm, personalized pregnancy guidance. Your AI companion is ready with weekly insights, gentle reminders, and caring check-ins.</p>
    <p>Start by completing your onboarding so we can tailor every recommendation.</p>
    <a style="${baseStyles.button}" href="${process.env.APP_BASE_URL || '#'}">Complete onboarding</a>
  `;

  return {
    subject: 'Welcome to MaMa Care — your AI pregnancy companion',
    text: `Hi ${name || 'there'},\n\nWelcome to MaMa Care! Complete your onboarding to personalize your journey.`,
    html: wrapHtml('Welcome to MaMa Care', content),
  };
};

export const buildDailyWellnessEmail = ({ name, tip }) => {
  const content = `
    <span style="${baseStyles.chip}">Daily wellness tip</span>
    <p>Hi ${name || 'there'},</p>
    <p>${tip}</p>
    <p>We are here to help you feel supported today.</p>
    <a style="${baseStyles.button}" href="${process.env.APP_BASE_URL || '#'}">Open MaMa Care</a>
  `;

  return {
    subject: 'Your daily wellness tip from MaMa Care',
    text: `Hi ${name || 'there'},\n${tip}`,
    html: wrapHtml('Daily Wellness Tip', content),
  };
};

export const buildAppointmentConfirmationEmail = ({ name, appointment }) => {
  const dateLabel = new Date(appointment.date).toLocaleDateString('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const content = `
    <span style="${baseStyles.chip}">Appointment confirmed</span>
    <p>Hi ${name || 'there'},</p>
    <p>Your appointment has been added to your schedule:</p>
    <ul style="${baseStyles.list}">
      <li><strong>Date:</strong> ${dateLabel}</li>
      <li><strong>Time:</strong> ${appointment.time}</li>
      <li><strong>Type:</strong> ${appointment.type}</li>
      <li><strong>Doctor:</strong> ${appointment.doctor}</li>
      ${appointment.location ? `<li><strong>Location:</strong> ${appointment.location}</li>` : ''}
    </ul>
    <p>We will remind you 30 minutes before and at the time of your appointment.</p>
  `;

  return {
    subject: 'Appointment confirmed in MaMa Care',
    text: `Hi ${name || 'there'},\nYour appointment is confirmed for ${dateLabel} at ${appointment.time}.`,
    html: wrapHtml('Appointment Confirmed', content),
  };
};

export const buildAppointmentReminderEmail = ({ name, appointment }) => {
  const dateLabel = new Date(appointment.date).toLocaleDateString('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const content = `
    <span style="${baseStyles.chip}">Upcoming appointment</span>
    <p>Hi ${name || 'there'},</p>
    <p>This is a gentle reminder about your upcoming appointment:</p>
    <ul style="${baseStyles.list}">
      <li><strong>Date:</strong> ${dateLabel}</li>
      <li><strong>Time:</strong> ${appointment.time}</li>
      <li><strong>Type:</strong> ${appointment.type}</li>
      <li><strong>Doctor:</strong> ${appointment.doctor}</li>
      ${appointment.location ? `<li><strong>Location:</strong> ${appointment.location}</li>` : ''}
    </ul>
    <p>We are here if you need anything before the visit.</p>
  `;

  return {
    subject: 'Upcoming appointment reminder',
    text: `Hi ${name || 'there'},\nYour appointment is on ${dateLabel} at ${appointment.time}.`,
    html: wrapHtml('Appointment Reminder', content),
  };
};

export const buildAppointmentTimeReminderEmail = ({ name, appointment, minutes }) => {
  const dateLabel = new Date(appointment.date).toLocaleDateString('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const label = minutes === 0 ? 'Happening now' : `${minutes} minutes away`;
  const content = `
    <span style="${baseStyles.chip}">${label}</span>
    <p>Hi ${name || 'there'},</p>
    <p>Your appointment is ${minutes === 0 ? 'starting now' : 'coming up soon'}:</p>
    <ul style="${baseStyles.list}">
      <li><strong>Date:</strong> ${dateLabel}</li>
      <li><strong>Time:</strong> ${appointment.time}</li>
      <li><strong>Type:</strong> ${appointment.type}</li>
      <li><strong>Doctor:</strong> ${appointment.doctor}</li>
      ${appointment.location ? `<li><strong>Location:</strong> ${appointment.location}</li>` : ''}
    </ul>
    <p>We hope everything goes smoothly today.</p>
  `;

  return {
    subject: minutes === 0 ? 'Your appointment is starting now' : `Your appointment is in ${minutes} minutes`,
    text: `Hi ${name || 'there'},\nYour appointment is ${minutes === 0 ? 'starting now' : `in ${minutes} minutes`} on ${dateLabel} at ${appointment.time}.`,
    html: wrapHtml('Appointment Reminder', content),
  };
};

export const buildRiskAlertEmail = ({ name, level, recommendations }) => {
  const content = `
    <span style="${baseStyles.chip}">Risk alert</span>
    <p>Hi ${name || 'there'},</p>
    <p>Your latest assessment shows a <strong>${level}</strong> risk level.</p>
    <ul style="${baseStyles.list}">
      ${(recommendations || []).map((item) => `<li>${item}</li>`).join('')}
    </ul>
    <p>If anything feels off, please reach out to your doctor.</p>
  `;

  return {
    subject: `MaMa Care risk alert: ${level} level`,
    text: `Hi ${name || 'there'},\nYour latest assessment shows a ${level} risk level.`,
    html: wrapHtml('Risk Alert', content),
  };
};

export const buildWeeklySummaryEmail = ({ name, week, insights }) => {
  const content = `
    <span style="${baseStyles.chip}">Weekly journey summary</span>
    <p>Hi ${name || 'there'},</p>
    <p>Here is your calm weekly snapshot for Week ${week || '—'}:</p>
    <ul style="${baseStyles.list}">
      ${insights.map((item) => `<li>${item}</li>`).join('')}
    </ul>
    <p>We are cheering you on every step of the way.</p>
    <a style="${baseStyles.button}" href="${process.env.APP_BASE_URL || '#'}">Open MaMa Care</a>
  `;

  return {
    subject: `Your Week ${week || ''} summary from MaMa Care`,
    text: `Hi ${name || 'there'},\nHere is your weekly summary.`,
    html: wrapHtml('Weekly Journey Summary', content),
  };
};