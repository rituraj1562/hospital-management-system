import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', index: true },
    ward: { type: String, required: true },
    roomNumber: { type: String, required: true },
    type: { type: String, enum: ['general', 'private', 'semi_private', 'icu', 'nicu', 'emergency'], default: 'general' },
    floor: String,
    dailyCharge: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

roomSchema.index({ hospitalId: 1, roomNumber: 1 }, { unique: true });

export const Room = mongoose.model('Room', roomSchema);
