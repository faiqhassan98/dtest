import jwt from 'jsonwebtoken';
import { config } from '../config.js';
export function generateToken(payload) {
    const options = {
        expiresIn: '7d' // hardcoded or can read from env as string
    };
    return jwt.sign(payload, config.jwtSecret, options);
}
