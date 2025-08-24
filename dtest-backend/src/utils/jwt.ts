import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config.js';

interface Payload {
  id: string;
  role: string;
}

export function generateToken(payload: Payload) {
  const options: SignOptions = {
    expiresIn: '7d' // hardcoded or can read from env as string
  };

  return jwt.sign(payload, config.jwtSecret, options);
}
