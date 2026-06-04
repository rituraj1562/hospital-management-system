import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
  {
    dayOfWeek: { type: Number, min: 0, max: 6 },
    startTime: String,
    endTime: String,
    slotMinutes: { type: Number, default: 20 },
    isAvailable: { type: Boolean, default: true }
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeCode: { type: String, required: true, unique: true },
    specialization: { type: String, required: true, index: true },
    department: String,
    qualification: [String],
    experienceYears: Number,
    consultationFee: { type: Number, default: 0 },
    availability: [availabilitySchema],
    licenseNumber: String,
    performance: {
      averageRating: { type: Number, default: 0 },
      consultations: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 }
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

doctorSchema.index({ specialization: 'text', department: 'text', employeeCode: 'text' });

export const Doctor = mongoose.model('Doctor', doctorSchema);
