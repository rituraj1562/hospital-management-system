import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', index: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    scheduledAt: { type: Date, required: true, index: true },
    durationMinutes: { type: Number, default: 20 },
    type: { type: String, enum: ['consultation', 'follow_up', 'emergency', 'telemedicine'], default: 'consultation' },
    status: {
      type: String,
      enum: ['booked', 'checked_in', 'in_consultation', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'],
      default: 'booked',
      index: true
    },
    reason: String,
    notes: String,
    fee: Number,
    cancelledReason: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

appointmentSchema.index({ hospitalId: 1, status: 1, scheduledAt: 1 });
appointmentSchema.index({ hospitalId: 1, doctorId: 1, patientId: 1 });
appointmentSchema.index({ doctorId: 1, scheduledAt: 1 }, { unique: true, partialFilterExpression: { status: { $nin: ['cancelled', 'rescheduled'] }, isDeleted: false } });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
