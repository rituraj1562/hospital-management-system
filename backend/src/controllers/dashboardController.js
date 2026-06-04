import { asyncHandler } from '../utils/asyncHandler.js';
import { Patient } from '../models/Patient.js';
import { Doctor } from '../models/Doctor.js';
import { Appointment } from '../models/Appointment.js';
import { Bill } from '../models/Bill.js';
import { Bed } from '../models/Bed.js';

export const adminDashboard = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [patients, doctors, appointments, revenue, beds, recentAppointments] = await Promise.all([
    Patient.countDocuments(),
    Doctor.countDocuments(),
    Appointment.countDocuments({ scheduledAt: { $gte: today, $lt: tomorrow } }),
    Bill.aggregate([{ $match: { status: { $in: ['paid', 'partially_paid'] } } }, { $group: { _id: null, total: { $sum: '$paidAmount' } } }]),
    Bed.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Appointment.find().sort('-createdAt').limit(8).populate('patientId doctorId')
  ]);

  res.json({
    success: true,
    data: {
      metrics: {
        totalPatients: patients,
        totalDoctors: doctors,
        dailyAppointments: appointments,
        revenue: revenue[0]?.total || 0
      },
      occupancy: beds,
      recentActivities: recentAppointments
    }
  });
});

export const doctorDashboard = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.user.id });
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const appointments = doctor
    ? await Appointment.find({ doctorId: doctor.id, scheduledAt: { $gte: start, $lt: end } }).populate('patientId')
    : [];
  res.json({ success: true, data: { doctor, todaysAppointments: appointments } });
});

export const patientDashboard = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ userId: req.user.id });
  const appointments = patient
    ? await Appointment.find({ patientId: patient.id, scheduledAt: { $gte: new Date() } }).sort('scheduledAt').limit(5).populate('doctorId')
    : [];
  const bills = patient ? await Bill.find({ patientId: patient.id }).sort('-createdAt').limit(5) : [];
  res.json({ success: true, data: { patient, upcomingAppointments: appointments, recentBills: bills } });
});
