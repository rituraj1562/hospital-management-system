import { AuditLog } from '../models/AuditLog.js';

export function attachAuditContext(req, res, next) {
  res.on('finish', () => {
    if (!req.user || req.method === 'GET' || res.statusCode >= 400) return;

    AuditLog.create({
      hospitalId: req.user.hospitalId,
      actorId: req.user.id,
      actorRole: req.user.role,
      action: `${req.method} ${req.originalUrl}`,
      resource: req.baseUrl?.split('/').pop() || req.path,
      resourceId: req.params?.id,
      metadata: { bodyKeys: Object.keys(req.body || {}) },
      ip: req.ip,
      userAgent: req.headers['user-agent']
    }).catch((error) => console.error('Audit log failed', error.message));
  });

  next();
}
