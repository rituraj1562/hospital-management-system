import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';

export function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, hospitalId: user.hospitalId },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpires }
  );
}

export function signRefreshToken(user, tokenVersion) {
  return jwt.sign(
    { sub: user.id, role: user.role, tokenVersion },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpires }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtAccessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret);
}

export function randomResetToken() {
  const raw = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hash };
}
