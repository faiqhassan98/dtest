import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { generateRandomPassword } from '../utils/password.js';
import { sendMail } from '../utils/email.js';

export async function listUsers(_req: Request, res: Response) {
  const users = await User.find().select('-password');
  res.json(users);
}

export async function createUser(req: Request, res: Response) {
  const { firstName, lastName, email, role, expiryDays } = req.body as {
    firstName: string; lastName: string; email: string; role?: 'admin'|'user'; expiryDays?: number;
  };

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(400).json({ message: 'Email already exists' });

  const passwordPlain = generateRandomPassword(12);
  const loginExpiry = new Date(Date.now() + (expiryDays ?? 31) * 24 * 60 * 60 * 1000);

  const user = await User.create({
    firstName, lastName, email: email.toLowerCase(), role: role || 'user',
    enabled: true, password: passwordPlain, loginExpiry
  });

  await sendMail(email, 'Your DTest account', `
    <p>Hello ${firstName},</p>
    <p>Your DTest account has been created.</p>
    <p><b>Email:</b> ${email}<br/><b>Password:</b> ${passwordPlain}</p>
    <p>Login access expires on: ${loginExpiry.toDateString()}</p>
  `);

  res.status(201).json({ id: user._id });
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const { enabled, expiryDate, resetPassword } = req.body as {
    enabled?: boolean; expiryDate?: string; resetPassword?: boolean;
  };

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (enabled !== undefined) user.enabled = enabled;
  if (expiryDate) user.loginExpiry = new Date(expiryDate);

  if (resetPassword) {
    const newPass = generateRandomPassword(12);
    user.password = newPass;
    await sendMail(user.email, 'Your DTest password was reset', `
      <p>Hello ${user.firstName},</p>
      <p>Your new password is: <b>${newPass}</b></p>
    `);
  }

  await user.save();
  res.json({ message: 'Updated' });
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ message: 'Deleted' });
}
