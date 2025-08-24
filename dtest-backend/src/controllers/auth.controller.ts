import { Request, Response } from "express";
import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  
  console.log('=== LOGIN DEBUG ===');
  console.log('Email received:', email);
  console.log('Password received:', password);
  
  const user = await User.findOne({ email });
  console.log('User found:', !!user);
  
  if (user) {
    console.log('User details:', {
      email: user.email,
      role: user.role,
      enabled: user.enabled,
      hasPassword: !!user.password
    });
    
    const passwordMatch = await user.comparePassword(password);
    console.log('Password match result:', passwordMatch);
  }
  
  if (!user || !(await user.comparePassword(password))) {
    console.log('Authentication failed');
    return res.status(401).json({ message: "Invalid credentials" });
  }
  
  if (!user.enabled) {
    console.log('User disabled');
    return res.status(403).json({ message: "User disabled" });
  }
  
  if (user.loginExpiry && user.loginExpiry < new Date()) {
    console.log('Login expired');
    return res.status(403).json({ message: "Login expired" });
  }
  
  console.log('Login successful');
  user.loginCount = (user.loginCount || 0) + 1;
  await user.save();

  const token = generateToken({
    id: user._id as unknown as string,
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