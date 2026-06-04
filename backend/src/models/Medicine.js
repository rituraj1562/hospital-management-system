import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', index: true },
    name: { type: String, required: true, trim: true },
    genericName: String,
    category: String,
    manufacturer: String,
    batchNumber: String,
    unit: { type: String, default: 'strip' },
    price: { type: Number, default: 0 },
    gstPercent: { type: Number, default: 12 },
    reorderLevel: { type: Number, default: 10 },
    expiryDate: Date,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

medicineSchema.index({ name: 'text', genericName: 'text', category: 'text' });

export const Medicine = mongoose.model('Medicine', medicineSchema);
