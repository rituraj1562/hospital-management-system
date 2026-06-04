import mongoose from 'mongoose';

const bedSchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', index: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    bedNumber: { type: String, required: true },
    status: { type: String, enum: ['available', 'occupied', 'maintenance', 'reserved'], default: 'available', index: true },
    currentPatientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }
  },
  { timestamps: true }
);

bedSchema.index({ roomId: 1, bedNumber: 1 }, { unique: true });

export const Bed = mongoose.model('Bed', bedSchema);
