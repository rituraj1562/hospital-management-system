import mongoose from 'mongoose';

const labReportSchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', index: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    testName: { type: String, required: true },
    testCode: String,
    sampleType: String,
    sampleCollectedAt: Date,
    status: { type: String, enum: ['requested', 'sample_collected', 'processing', 'completed', 'cancelled'], default: 'requested', index: true },
    results: [
      {
        parameter: String,
        value: String,
        unit: String,
        referenceRange: String,
        flag: { type: String, enum: ['normal', 'low', 'high', 'critical'], default: 'normal' }
      }
    ],
    remarks: String,
    reportUrl: String,
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

labReportSchema.index({ hospitalId: 1, status: 1, createdAt: -1 });

export const LabReport = mongoose.model('LabReport', labReportSchema);
