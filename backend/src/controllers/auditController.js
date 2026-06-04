import { AuditLog } from '../models/AuditLog.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listAuditLogs = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.hospitalId) filter.hospitalId = req.user.hospitalId;
  if (req.query.actorId) filter.actorId = req.query.actorId;
  if (req.query.resource) filter.resource = req.query.resource;

  const data = await AuditLog.find(filter)
    .sort('-createdAt')
    .limit(Number(req.query.limit || 50))
    .populate('actorId', 'name email role');

  res.json({ success: true, data });
});
