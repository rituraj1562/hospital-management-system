import { Router } from 'express';
import { approveUser, firebaseSession, forgotPassword, login, logout, me, refresh, register, rejectUser, resetPassword } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/security.js';
import { validate } from '../middleware/validate.js';
import { forgotRules, loginRules, registerRules, resetRules } from '../validators/authValidators.js';
import { roles } from '../utils/roles.js';

const router = Router();

router.post('/register', authRateLimiter, registerRules, validate, register);
router.post('/login', authRateLimiter, loginRules, validate, login);
router.post('/firebase-session', authRateLimiter, firebaseSession);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', authRateLimiter, forgotRules, validate, forgotPassword);
router.post('/reset-password/:token', authRateLimiter, resetRules, validate, resetPassword);
router.get('/me', authenticate, me);
router.patch('/users/:id/approve', authenticate, authorize(roles.SUPER_ADMIN, roles.HOSPITAL_ADMIN), approveUser);
router.patch('/users/:id/reject', authenticate, authorize(roles.SUPER_ADMIN, roles.HOSPITAL_ADMIN), rejectUser);

export default router;
