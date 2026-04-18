import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export async function sendReportEmail(options: {
  to: string;
  cc: string[];
  subject: string;
  html: string;
}) {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@example.com',
    to: options.to,
    cc: options.cc.join(', '),
    subject: options.subject,
    html: options.html,
  });
  return info;
}
