import { body } from 'express-validator';
import { allRoles } from '../utils/roles.js';

export const registerRules = [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('role').optional().isIn(allRoles)
];

export const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

export const forgotRules = [body('email').isEmail().normalizeEmail()];
export const resetRules = [body('password').isLength({ min: 8 })];
