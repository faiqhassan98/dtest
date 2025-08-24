import nodemailer from 'nodemailer';
import { config } from '../config.js';
const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: false,
    auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
});
export async function sendMail(to, subject, html) {
    await transporter.sendMail({ from: config.smtp.from, to, subject, html });
}
