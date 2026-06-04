import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', index: true },
    billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['cash', 'card', 'upi', 'net_banking', 'insurance'], default: 'cash' },
    transactionId: String,
    status: { type: String, enum: ['pending', 'successful', 'failed', 'refunded'], default: 'successful' },
    paidAt: { type: Date, default: Date.now },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
