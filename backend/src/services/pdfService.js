import PDFDocument from 'pdfkit';

export function generateInvoicePdfStream(bill) {
  const doc = new PDFDocument({ margin: 48 });
  doc.fontSize(22).fillColor('#0f766e').text('Demo City Hospital', { align: 'center' });
  doc.fontSize(10).fillColor('#475569').text('Pune, Maharashtra · GSTIN: DEMO-GST-001 · +91-9999999999', { align: 'center' });
  doc.moveDown();
  doc.moveTo(48, doc.y).lineTo(564, doc.y).strokeColor('#cbd5e1').stroke();
  doc.moveDown();
  doc.fontSize(18).fillColor('#0f172a').text('Tax Invoice');
  doc.moveDown(0.5);
  doc.fontSize(11).text(`Invoice: ${bill.invoiceNumber}`);
  doc.text(`Status: ${bill.status}`);
  doc.text(`Date: ${new Date(bill.createdAt || Date.now()).toLocaleDateString()}`);
  doc.moveDown();
  doc.fontSize(12).text('Charges', { underline: true });
  bill.items.forEach((item) => {
    doc.fontSize(10).text(`${item.description} x ${item.quantity} @ Rs. ${item.unitPrice.toFixed(2)} | GST ${item.gstPercent}% | Rs. ${item.total.toFixed(2)}`);
  });
  doc.moveDown();
  doc.fontSize(11).text(`Subtotal: Rs. ${bill.subtotal.toFixed(2)}`, { align: 'right' });
  doc.text(`GST: Rs. ${bill.gstAmount.toFixed(2)}`, { align: 'right' });
  doc.fontSize(14).fillColor('#0f766e').text(`Total: Rs. ${bill.totalAmount.toFixed(2)}`, { align: 'right' });
  doc.moveDown(2);
  doc.fillColor('#0f172a').fontSize(10).text('Payment QR / UPI: demo-hms@upi');
  doc.text('Authorized signature: ____________________', { align: 'right' });
  doc.end();
  return doc;
}

export function generatePrescriptionPdfStream(prescription) {
  const doc = new PDFDocument({ margin: 48 });
  doc.fontSize(22).fillColor('#0f766e').text('Demo City Hospital', { align: 'center' });
  doc.fontSize(10).fillColor('#475569').text('Clinical Prescription · Pune, Maharashtra', { align: 'center' });
  doc.moveDown();
  doc.fontSize(16).fillColor('#0f172a').text('Prescription');
  doc.fontSize(11).text(`Date: ${new Date(prescription.createdAt || Date.now()).toLocaleDateString()}`);
  doc.text(`Diagnosis: ${prescription.diagnosis || '-'}`);
  doc.moveDown();
  doc.fontSize(12).text('Medicines', { underline: true });
  prescription.medicines.forEach((medicine, index) => {
    doc.fontSize(10).text(`${index + 1}. ${medicine.name} - ${medicine.dosage || ''} ${medicine.frequency || ''} ${medicine.duration || ''}`);
    if (medicine.instructions) doc.text(`   ${medicine.instructions}`);
  });
  doc.moveDown(2);
  doc.fontSize(10).text('Doctor signature: ____________________', { align: 'right' });
  doc.text('Follow-up and emergency instructions are subject to treating doctor advice.');
  doc.end();
  return doc;
}
