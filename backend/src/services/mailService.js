import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export async function sendMail({ to, subject, html }) {
  if (!env.mail.host || !env.mail.user) {
    console.log(`[mail:dev] ${subject} -> ${to}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    auth: { user: env.mail.user, pass: env.mail.pass }
  });

  await transporter.sendMail({ from: env.mail.from, to, subject, html });
}
