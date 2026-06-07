import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export const MAIL_FROM = '"Web Grupo Pro-energéticos" <contactoproenergeticos@gmail.com>';

export function getMailTransporter(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.GOOGLE_APP_PASSWORD?.trim();
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}
