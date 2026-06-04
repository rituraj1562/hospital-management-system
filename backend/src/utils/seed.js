import { connectDatabase } from '../config/db.js';
import { Hospital } from '../models/Hospital.js';
import { User } from '../models/User.js';
import { Patient } from '../models/Patient.js';
import { Doctor } from '../models/Doctor.js';
import { Appointment } from '../models/Appointment.js';
import { LabReport } from '../models/LabReport.js';
import { Medicine } from '../models/Medicine.js';
import { Inventory } from '../models/Inventory.js';
import { Room } from '../models/Room.js';
import { Bed } from '../models/Bed.js';
import { Admission } from '../models/Admission.js';
import { Bill } from '../models/Bill.js';
import { roles } from './roles.js';

await connectDatabase();

const hospital = await Hospital.findOneAndUpdate(
  { code: 'DEMO' },
  {
    name: 'Demo City Hospital',
    code: 'DEMO',
    email: 'admin@demo-hms.local',
    phone: '+91-9999999999',
    address: { city: 'Pune', state: 'Maharashtra', country: 'India' }
  },
  { upsert: true, new: true }
);

async function upsertUser({ email, name, role }) {
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name,
      email,
      role,
      hospitalId: hospital.id,
      approvalStatus: 'approved',
      emailVerified: true,
      password: 'Admin@12345',
      isActive: true
    });
  } else {
    user.name = name;
    user.role = role;
    user.hospitalId = hospital.id;
    user.approvalStatus = 'approved';
    user.emailVerified = true;
    user.isActive = true;
    await user.save();
  }
  return user;
}

const admin = await upsertUser({ email: 'admin@demo-hms.local', name: 'Demo Super Admin', role: roles.SUPER_ADMIN });
const doctorUser = await upsertUser({ email: 'doctor@demo-hms.local', name: 'Dr. Meera Sharma', role: roles.DOCTOR });
await upsertUser({ email: 'reception@demo-hms.local', name: 'Riya Reception', role: roles.RECEPTIONIST });
await upsertUser({ email: 'pharmacy@demo-hms.local', name: 'Aman Pharmacy', role: roles.PHARMACIST });
await upsertUser({ email: 'lab@demo-hms.local', name: 'Nisha Lab', role: roles.LAB_TECH });

const doctor = await Doctor.findOneAndUpdate(
  { employeeCode: 'DOC-001' },
  {
    hospitalId: hospital.id,
    userId: doctorUser.id,
    employeeCode: 'DOC-001',
    specialization: 'Cardiology',
    department: 'Cardiac Care',
    qualification: ['MBBS', 'MD'],
    experienceYears: 9,
    consultationFee: 800,
    availability: [{ dayOfWeek: 1, startTime: '09:00', endTime: '14:00', slotMinutes: 20 }]
  },
  { upsert: true, new: true }
);

const patients = await Patient.insertMany(
  [
    { mrn: 'MRN-1001', firstName: 'Ankit', lastName: 'Pandey', phone: '9876543210', bloodGroup: 'B+', gender: 'male' },
    { mrn: 'MRN-1002', firstName: 'Priya', lastName: 'Nair', phone: '9876543211', bloodGroup: 'O+', gender: 'female' },
    { mrn: 'MRN-1003', firstName: 'Rahul', lastName: 'Verma', phone: '9876543212', bloodGroup: 'A-', gender: 'male' }
  ].map((patient) => ({ ...patient, hospitalId: hospital.id, createdBy: admin.id, updatedBy: admin.id })),
  { ordered: false }
).catch(() => Patient.find({ hospitalId: hospital.id }).limit(3));

const room = await Room.findOneAndUpdate(
  { hospitalId: hospital.id, roomNumber: '301' },
  { hospitalId: hospital.id, ward: 'General', roomNumber: '301', type: 'general', floor: '3', dailyCharge: 2500 },
  { upsert: true, new: true }
);

await Bed.findOneAndUpdate({ roomId: room.id, bedNumber: '301-A' }, { hospitalId: hospital.id, roomId: room.id, bedNumber: '301-A', status: 'available' }, { upsert: true });
await Bed.findOneAndUpdate({ roomId: room.id, bedNumber: '301-B' }, { hospitalId: hospital.id, roomId: room.id, bedNumber: '301-B', status: 'occupied', currentPatientId: patients[0]?.id }, { upsert: true });

const medicine = await Medicine.findOneAndUpdate(
  { hospitalId: hospital.id, name: 'Paracetamol 500mg' },
  { hospitalId: hospital.id, name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'Analgesic', price: 20, reorderLevel: 50 },
  { upsert: true, new: true }
);

await Inventory.create({ hospitalId: hospital.id, medicineId: medicine.id, quantity: 100, movementType: 'purchase', status: 'received', createdBy: admin.id }).catch(() => undefined);

if (patients[0]) {
  await Appointment.create({
    hospitalId: hospital.id,
    patientId: patients[0].id,
    doctorId: doctor.id,
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'booked',
    reason: 'Chest pain review',
    fee: 800,
    createdBy: admin.id,
    updatedBy: admin.id
  }).catch(() => undefined);

  await LabReport.create({
    hospitalId: hospital.id,
    patientId: patients[0].id,
    doctorId: doctor.id,
    testName: 'Complete Blood Count',
    sampleType: 'Blood',
    status: 'requested',
    createdBy: admin.id
  }).catch(() => undefined);

  await Admission.create({
    hospitalId: hospital.id,
    patientId: patients[0].id,
    doctorId: doctor.id,
    roomId: room.id,
    reason: 'Observation',
    status: 'bed_allocated',
    createdBy: admin.id
  }).catch(() => undefined);

  await Bill.create({
    hospitalId: hospital.id,
    patientId: patients[0].id,
    invoiceNumber: `INV-${Date.now()}`,
    status: 'issued',
    items: [{ description: 'Consultation', category: 'consultation', quantity: 1, unitPrice: 800, gstPercent: 18 }],
    createdBy: admin.id
  }).catch(() => undefined);
}

console.log('Seed complete. Demo password for all seeded users: Admin@12345');
console.log('Admin: admin@demo-hms.local');
console.log('Doctor: doctor@demo-hms.local');
process.exit(0);
