import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', index: true },
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, default: 0 },
    movementType: { type: String, enum: ['purchase', 'sale', 'adjustment', 'return', 'dispensed', 'billed'], required: true },
    status: { type: String, enum: ['purchased', 'received', 'dispensed', 'billed', 'adjusted'], default: 'received', index: true },
    referenceNo: String,
    supplier: String,
    purchasePrice: Number,
    salePrice: Number,
    notes: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

export const Inventory = mongoose.model('Inventory', inventorySchema);
