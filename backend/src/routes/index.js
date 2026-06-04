import { Router } from 'express';
import authRoutes from './authRoutes.js';
import { resourceRoute } from './resourceRoute.js';
import { roles, adminRoles, clinicalRoles } from '../utils/roles.js';
import {
  admissions,
  appointments,
  beds,
  bills,
  doctors,
  inventory,
  labReports,
  medicalRecords,
  medicines,
  patients,
  payments,
  prescriptions,
  rooms,
  users
} from '../controllers/domainControllers.js';
import { appointmentRules, billRules, doctorRules, patientRules, prescriptionRules } from '../validators/domainValidators.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { adminDashboard, doctorDashboard, patientDashboard } from '../controllers/dashboardController.js';
import { billPdf, prescriptionPdf } from '../controllers/pdfController.js';
import { transitionResource } from '../controllers/workflowController.js';
import { listAuditLogs } from '../controllers/auditController.js';
import { sendNotification } from '../controllers/notificationController.js';

const router = Router();
const staff = [...adminRoles, roles.RECEPTIONIST, roles.DOCTOR, roles.PHARMACIST, roles.LAB_TECH];
const billing = [...adminRoles, roles.RECEPTIONIST, roles.PHARMACIST];
const pharmacy = [...adminRoles, roles.PHARMACIST];
const lab = [...adminRoles, roles.DOCTOR, roles.LAB_TECH];

router.use('/auth', authRoutes);

router.get('/dashboard/admin', authenticate, authorize(...adminRoles, roles.RECEPTIONIST), adminDashboard);
router.get('/dashboard/doctor', authenticate, authorize(roles.DOCTOR), doctorDashboard);
router.get('/dashboard/patient', authenticate, authorize(roles.PATIENT), patientDashboard);
router.get('/audit-logs', authenticate, authorize(...adminRoles), listAuditLogs);
router.post('/notifications', authenticate, authorize(...adminRoles, roles.RECEPTIONIST), sendNotification);

router.use('/users', resourceRoute(users, { read: adminRoles, write: adminRoles, admin: [roles.SUPER_ADMIN] }));
router.use('/patients', resourceRoute(patients, { read: [...staff, roles.PATIENT], write: [...adminRoles, roles.RECEPTIONIST], admin: adminRoles }, patientRules));
router.use('/doctors', resourceRoute(doctors, { read: [...staff, roles.PATIENT], write: adminRoles, admin: adminRoles }, doctorRules));
router.use('/appointments', resourceRoute(appointments, { read: [...staff, roles.PATIENT], write: [...adminRoles, roles.RECEPTIONIST, roles.DOCTOR, roles.PATIENT], admin: adminRoles }, appointmentRules));
router.use('/medical-records', resourceRoute(medicalRecords, { read: [...clinicalRoles, ...adminRoles, roles.PATIENT], write: [...clinicalRoles, ...adminRoles], admin: adminRoles }));
router.use('/prescriptions', resourceRoute(prescriptions, { read: [...clinicalRoles, ...adminRoles, roles.PHARMACIST, roles.PATIENT], write: [roles.DOCTOR, ...adminRoles], admin: adminRoles }, prescriptionRules));
router.use('/lab-reports', resourceRoute(labReports, { read: [...lab, roles.PATIENT], write: [...adminRoles, roles.LAB_TECH], admin: adminRoles }));
router.use('/medicines', resourceRoute(medicines, { read: [...staff, roles.PATIENT], write: pharmacy, admin: adminRoles }));
router.use('/inventory', resourceRoute(inventory, { read: pharmacy, write: pharmacy, admin: adminRoles }));
router.use('/rooms', resourceRoute(rooms, { read: staff, write: adminRoles, admin: adminRoles }));
router.use('/beds', resourceRoute(beds, { read: staff, write: adminRoles, admin: adminRoles }));
router.use('/admissions', resourceRoute(admissions, { read: staff, write: [...adminRoles, roles.RECEPTIONIST], admin: adminRoles }));
router.use('/bills', resourceRoute(bills, { read: [...billing, roles.PATIENT], write: billing, admin: adminRoles }, billRules));
router.use('/payments', resourceRoute(payments, { read: [...billing, roles.PATIENT], write: billing, admin: adminRoles }));

router.get('/bills/:id/pdf', authenticate, authorize(...billing, roles.PATIENT), billPdf);
router.get('/prescriptions/:id/pdf', authenticate, authorize(...clinicalRoles, roles.PHARMACIST, roles.PATIENT), prescriptionPdf);

router.patch('/appointments/:id/transition', authenticate, authorize(...staff), transitionResource('appointment'));
router.patch('/lab-reports/:id/transition', authenticate, authorize(...lab), transitionResource('lab'));
router.patch('/inventory/:id/transition', authenticate, authorize(...pharmacy), transitionResource('pharmacy'));
router.patch('/admissions/:id/transition', authenticate, authorize(...staff), transitionResource('inpatient'));
router.patch('/bills/:id/transition', authenticate, authorize(...billing), transitionResource('billing'));

export default router;
