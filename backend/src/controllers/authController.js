import crypto from 'crypto';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { randomResetToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';
import { sendMail } from '../services/mailService.js';
import { env } from '../config/env.js';
import { verifyFirebaseToken } from '../config/firebase.js';
import { roles } from '../utils/roles.js';

function authPayload(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, user.refreshTokenVersion);
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      approvalStatus: user.approvalStatus,
      emailVerified: user.emailVerified,
      hospitalId: user.hospitalId
    }
  };
}

export const register = asyncHandler(async (req, res) => {
  const approvalStatus = req.body.role && req.body.role !== roles.PATIENT ? 'pending' : 'approved';
  const user = await User.create({ ...req.body, approvalStatus });
  res.status(201).json({ success: true, data: authPayload(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!user.isActive) throw new AppError('Account is disabled', 403);
  user.refreshTokenVersion += 1;
  user.sessions.push({
    tokenVersion: user.refreshTokenVersion,
    userAgent: req.headers['user-agent'],
    ip: req.ip
  });
  await user.save();
  res.json({ success: true, data: authPayload(user) });
});

export const firebaseSession = asyncHandler(async (req, res) => {
  const { idToken, role } = req.body;
  if (!idToken) throw new AppError('Firebase ID token required', 401);

  const decoded = await verifyFirebaseToken(idToken);
  const email = decoded.email?.toLowerCase();
  if (!email) throw new AppError('Firebase account must have an email address', 422);

  let user = await User.findOne({ $or: [{ firebaseUid: decoded.uid }, { email }] });
  const requestedRole = role || roles.PATIENT;
  if (!user) {
    user = await User.create({
      firebaseUid: decoded.uid,
      name: decoded.name || email.split('@')[0],
      email,
      role: requestedRole,
      approvalStatus: requestedRole === roles.PATIENT ? 'approved' : 'pending',
      emailVerified: Boolean(decoded.email_verified),
      password: `firebase:${decoded.uid}:${Date.now()}`
    });
  } else if (!user.firebaseUid) {
    user.firebaseUid = decoded.uid;
    user.emailVerified = Boolean(decoded.email_verified);
    await user.save({ validateBeforeSave: false });
  }

  if (!user.isActive) throw new AppError('Account is disabled', 403);
  if (user.approvalStatus !== 'approved') throw new AppError('Your account is pending administrator approval', 403);
  res.json({ success: true, data: authPayload(user) });
});

export const approveUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { approvalStatus: 'approved', approvedBy: req.user.id, approvedAt: new Date() },
    { new: true }
  );
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, data: user });
});

export const rejectUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { approvalStatus: 'rejected' }, { new: true });
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, data: user });
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError('Refresh token required', 401);
  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.sub);
  if (!user || user.refreshTokenVersion !== decoded.tokenVersion) {
    throw new AppError('Invalid refresh token', 401);
  }
  res.json({ success: true, data: authPayload(user) });
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);
    await User.findByIdAndUpdate(decoded.sub, { $inc: { refreshTokenVersion: 1 } });
  }
  res.status(204).send();
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+resetPasswordToken');
  if (!user) return res.json({ success: true, message: 'If the email exists, a reset link has been sent.' });

  const { raw, hash } = randomResetToken();
  user.resetPasswordToken = hash;
  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const link = `${env.clientUrl}/reset-password/${raw}`;
  await sendMail({ to: user.email, subject: 'Reset your HMS password', html: `<p>Reset password: <a href="${link}">${link}</a></p>` });
  res.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) throw new AppError('Reset token is invalid or expired', 400);
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshTokenVersion += 1;
  await user.save();
  res.json({ success: true, data: authPayload(user) });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, data: user });
});
