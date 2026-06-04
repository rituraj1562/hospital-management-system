import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', index: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    bedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed' },
    admittedAt: { type: Date, default: Date.now },
    dischargedAt: Date,
    reason: String,
    dischargeSummary: String,
    status: { type: String, enum: ['admitted', 'bed_allocated', 'under_treatment', 'discharged', 'transferred'], default: 'admitted', index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

export const Admission = mongoose.model('Admission', admissionSchema);
