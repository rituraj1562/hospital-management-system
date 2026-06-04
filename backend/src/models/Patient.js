import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mrn: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    dateOfBirth: Date,
    bloodGroup: String,
    phone: String,
    email: String,
    address: String,
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    },
    insurance: {
      provider: String,
      policyNumber: String,
      expiryDate: Date,
      coverageAmount: Number
    },
    allergies: [String],
    chronicConditions: [String],
    medicalHistory: [
      {
        condition: String,
        diagnosedAt: Date,
        notes: String
      }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

patientSchema.index({ hospitalId: 1, isDeleted: 1, createdAt: -1 });
patientSchema.index({ firstName: 'text', lastName: 'text', mrn: 'text', phone: 'text', email: 'text' });

export const Patient = mongoose.model('Patient', patientSchema);
