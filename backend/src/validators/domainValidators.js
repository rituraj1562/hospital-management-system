import { body, param } from 'express-validator';

export const mongoIdParam = [param('id').isMongoId()];

export const patientRules = [
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('mrn').trim().notEmpty()
];

export const doctorRules = [
  body('userId').isMongoId(),
  body('employeeCode').trim().notEmpty(),
  body('specialization').trim().notEmpty()
];

export const appointmentRules = [
  body('patientId').isMongoId(),
  body('doctorId').isMongoId(),
  body('scheduledAt').isISO8601().toDate()
];

export const prescriptionRules = [
  body('patientId').isMongoId(),
  body('doctorId').isMongoId(),
  body('medicines').isArray({ min: 1 })
];

export const billRules = [
  body('patientId').isMongoId(),
  body('invoiceNumber').trim().notEmpty(),
  body('items').isArray({ min: 1 })
];
