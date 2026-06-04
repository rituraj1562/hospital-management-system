import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    },
    phone: String,
    email: String,
    gstNumber: String,
    logoUrl: String,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Hospital = mongoose.model('Hospital', hospitalSchema);
