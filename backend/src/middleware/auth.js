import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../utils/tokens.js';
import { User } from '../models/User.js';
import { verifyFirebaseToken } from '../config/firebase.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) throw new AppError('Authentication required', 401);

  let user;
  try {
    const decoded = verifyAccessToken(token);
    user = await User.findById(decoded.sub).select('+passwordChangedAt');
  } catch {
    const decoded = await verifyFirebaseToken(token);
    user = await User.findOne({ $or: [{ firebaseUid: decoded.uid }, { email: decoded.email?.toLowerCase() }] });
  }

  if (!user || !user.isActive) throw new AppError('User no longer exists or is inactive', 401);
  if (user.approvalStatus !== 'approved') throw new AppError('Your account is pending administrator approval', 403);

  req.user = {
    id: user.id,
    role: user.role,
    approvalStatus: user.approvalStatus,
    hospitalId: user.hospitalId?.toString(),
    name: user.name,
    email: user.email
  };
  next();
});

export const authorize = (...allowedRoles) => (req, _res, next) => {
  if (!allowedRoles.includes(req.user?.role)) {
    throw new AppError('You do not have permission to perform this action', 403);
  }
  next();
};
