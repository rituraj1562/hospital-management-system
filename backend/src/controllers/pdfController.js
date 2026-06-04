import { Bill } from '../models/Bill.js';
import { Prescription } from '../models/Prescription.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateInvoicePdfStream, generatePrescriptionPdfStream } from '../services/pdfService.js';

export const billPdf = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  if (!bill) throw new AppError('Bill not found', 404);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${bill.invoiceNumber}.pdf"`);
  generateInvoicePdfStream(bill).pipe(res);
});

export const prescriptionPdf = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);
  if (!prescription) throw new AppError('Prescription not found', 404);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="prescription-${prescription.id}.pdf"`);
  generatePrescriptionPdfStream(prescription).pipe(res);
});
