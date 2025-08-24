import { Request, Response } from 'express';
import { TestAttempt } from '../models/TestAttempt.js';
import { User } from '../models/User.js';

export async function overview(_req: Request, res: Response) {
  const [attempts, users] = await Promise.all([TestAttempt.find().lean(), User.find().lean()]);
  const totalAttempts = attempts.length;
  const avgScore = totalAttempts ? Math.round(attempts.reduce((s,a)=>s+a.score,0)/totalAttempts) : 0;
  const totalUsers = users.length;
  const logins = users.reduce((s,u)=>s+(u.loginCount||0),0);

  res.json({
    reading: { totalAttempts, avgScore },
    users: { totalUsers, totalLogins: logins }
  });
}

export async function userPerformance(req: Request, res: Response) {
  const { userId } = req.params;
  const list = await TestAttempt.find({ userId }).sort({ createdAt: -1 }).lean();
  res.json(list);
}
