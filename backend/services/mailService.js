require('dotenv').config();
const nodemailer = require('nodemailer');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function createTransporter() {
  const user = process.env.SMTP_USER;
  const pass = (process.env.SMTP_PASS || '').replace(/\s/g, '');

  if (!user || !pass) {
    throw new Error('SMTP не настроен');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });
}

async function sendContactEmail(contactRequest) {
  const transporter = createTransporter();
  const to = process.env.SMTP_TO || process.env.SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || 'Органик Маркет';
  const name = escapeHtml(contactRequest.name);
  const email = escapeHtml(contactRequest.email);
  const message = escapeHtml(contactRequest.message).replace(/\n/g, '<br>');

  return transporter.sendMail({
    from: `"${fromName}" <${process.env.SMTP_USER}>`,
    to,
    replyTo: contactRequest.email,
    subject: `Обратная связь: ${contactRequest.name}`,
    text: [
      `Имя: ${contactRequest.name}`,
      `Email: ${contactRequest.email}`,
      '',
      contactRequest.message,
    ].join('\n'),
    html: `
      <h2>Новая заявка с сайта</h2>
      <p><strong>Имя:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Сообщение:</strong></p>
      <p>${message}</p>
    `,
  });
}

module.exports = {
  sendContactEmail,
};
