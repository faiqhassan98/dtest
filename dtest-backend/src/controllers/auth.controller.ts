import { Request, Response } from "express";
import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  if (!user.enabled) return res.status(403).json({ message: "User disabled" });
  
  if (user.loginExpiry && user.loginExpiry < new Date()) {
    return res.status(403).json({ message: "Login expired" });
  }
  user.loginCount = (user.loginCount || 0) + 1;
  await user.save();

  const token = generateToken({
    id: user._id as unknown as string, // force as string
    role: user.role,
  });
  res.json({
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
}
