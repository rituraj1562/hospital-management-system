import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    title: String,
    type: { type: String, enum: ['lab_report', 'radiology_report', 'discharge_summary', 'other'], default: 'other' },
    url: String,
    publicId: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const medicalRecordSchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', index: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    diagnosis: String,
    treatment: String,
    notes: String,
    vitals: {
      temperature: Number,
      bloodPressure: String,
      pulse: Number,
      respiratoryRate: Number,
      oxygenSaturation: Number,
      weight: Number
    },
    prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }],
    documents: [documentSchema]
  },
  { timestamps: true }
);

export const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
