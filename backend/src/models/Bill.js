import mongoose from 'mongoose';

const billItemSchema = new mongoose.Schema(
  {
    description: String,
    category: { type: String, enum: ['consultation', 'room', 'lab', 'pharmacy', 'procedure', 'other'], default: 'other' },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
    gstPercent: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  { _id: false }
);

const billSchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', index: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    admissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission' },
    invoiceNumber: { type: String, required: true, unique: true },
    items: [billItemSchema],
    subtotal: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'issued', 'partially_paid', 'paid', 'cancelled'], default: 'draft', index: true },
    dueDate: Date,
    pdfUrl: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

billSchema.pre('save', function calculateTotals(next) {
  this.items = this.items.map((item) => {
    const taxable = item.quantity * item.unitPrice;
    const plain = typeof item.toObject === 'function' ? item.toObject() : item;
    return { ...plain, total: taxable + (taxable * item.gstPercent) / 100 };
  });
  this.subtotal = this.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  this.gstAmount = this.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.gstPercent) / 100, 0);
  this.totalAmount = this.subtotal + this.gstAmount - this.discount;
  next();
});

export const Bill = mongoose.model('Bill', billSchema);
