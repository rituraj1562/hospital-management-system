import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { allRoles, roles } from '../utils/roles.js';

const refreshSessionSchema = new mongoose.Schema(
  {
    tokenVersion: { type: Number, required: true },
    userAgent: String,
    ip: String,
    expiresAt: Date,
    revokedAt: Date
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    firebaseUid: { type: String, unique: true, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: String,
    avatar: String,
    role: { type: String, enum: allRoles, default: roles.PATIENT, index: true },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved', index: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    emailVerified: { type: Boolean, default: false },
    password: { type: String, required: true, minlength: 8, select: false },
    isActive: { type: Boolean, default: true },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: Date,
    passwordChangedAt: Date,
    refreshTokenVersion: { type: Number, default: 0 },
    sessions: [refreshSessionSchema]
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = new Date();
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model('User', userSchema);
