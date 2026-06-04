import { Appointment } from '../models/Appointment.js';
import { LabReport } from '../models/LabReport.js';
import { Inventory } from '../models/Inventory.js';
import { Admission } from '../models/Admission.js';
import { Bill } from '../models/Bill.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { roles } from '../utils/roles.js';
import { sendMail } from '../services/mailService.js';

const transitions = {
  appointment: {
    model: Appointment,
    allowed: {
      booked: ['checked_in', 'cancelled', 'rescheduled', 'no_show'],
      checked_in: ['in_consultation', 'cancelled'],
      in_consultation: ['completed'],
      in_progress: ['completed'],
      completed: [],
      cancelled: [],
      no_show: [],
      rescheduled: []
    }
  },
  lab: {
    model: LabReport,
    allowed: {
      requested: ['sample_collected', 'cancelled'],
      sample_collected: ['processing'],
      processing: ['completed'],
      completed: [],
      cancelled: []
    }
  },
  pharmacy: {
    model: Inventory,
    allowed: {
      purchased: ['received'],
      received: ['dispensed', 'adjusted'],
      dispensed: ['billed'],
      billed: [],
      adjusted: []
    }
  },
  inpatient: {
    model: Admission,
    allowed: {
      admitted: ['bed_allocated', 'transferred'],
      bed_allocated: ['under_treatment', 'transferred'],
      under_treatment: ['discharged', 'transferred'],
      discharged: [],
      transferred: []
    }
  },
  billing: {
    model: Bill,
    allowed: {
      draft: ['issued', 'cancelled'],
      issued: ['partially_paid', 'paid', 'cancelled'],
      partially_paid: ['paid', 'cancelled'],
      paid: [],
      cancelled: []
    }
  }
};

function scopedFilter(req, id) {
  const filter = { _id: id, isDeleted: { $ne: true } };
  if (req.user?.hospitalId && req.user.role !== roles.SUPER_ADMIN) filter.hospitalId = req.user.hospitalId;
  return filter;
}

export const transitionResource = (resource) =>
  asyncHandler(async (req, res) => {
    const config = transitions[resource];
    if (!config) throw new AppError('Unsupported workflow resource', 404);

    const record = await config.model.findOne(scopedFilter(req, req.params.id));
    if (!record) throw new AppError(`${resource} record not found`, 404);

    const nextStatus = req.body.status;
    const allowed = config.allowed[record.status] || [];
    if (!allowed.includes(nextStatus)) {
      throw new AppError(`Invalid transition from ${record.status} to ${nextStatus}`, 422, { allowed });
    }

    record.status = nextStatus;
    record.updatedBy = req.user.id;
    if (resource === 'billing' && nextStatus === 'paid') record.paidAmount = record.totalAmount;
    if (resource === 'inpatient' && nextStatus === 'discharged') record.dischargedAt = new Date();
    await record.save();

    if (resource === 'appointment' && nextStatus === 'completed') {
      sendMail({ to: 'demo@demo-hms.local', subject: 'Appointment completed', html: '<p>Your appointment is complete.</p>' }).catch(() => undefined);
    }
    if (resource === 'billing' && nextStatus === 'paid') {
      sendMail({ to: 'billing@demo-hms.local', subject: 'Payment received', html: '<p>A bill payment was recorded.</p>' }).catch(() => undefined);
    }
    if (resource === 'lab' && nextStatus === 'completed') {
      sendMail({ to: 'lab@demo-hms.local', subject: 'Lab report completed', html: '<p>A lab report is ready for doctor review.</p>' }).catch(() => undefined);
    }

    res.json({ success: true, data: record });
  });
