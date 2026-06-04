import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { buildQuery } from '../utils/apiFeatures.js';
import { roles } from '../utils/roles.js';

function tenantFilter(req, filter = {}) {
  const base = { ...filter };
  if ('isDeleted' in (req.query || {}) === false) base.isDeleted = { $ne: true };
  if (req.user?.hospitalId && req.user.role !== roles.SUPER_ADMIN) {
    base.hospitalId = req.user.hospitalId;
  }
  return base;
}

export function createCrudController(Model, options = {}) {
  const defaultPopulate = Array.isArray(options) ? options : options.populate || [];

  return {
    list: asyncHandler(async (req, res) => {
      const query = buildQuery(Model, tenantFilter(req, req.query));
      defaultPopulate.forEach((path) => query.populate(path));
      const data = await query;
      res.json({ success: true, count: data.length, data });
    }),

    get: asyncHandler(async (req, res) => {
      const query = Model.findOne(tenantFilter(req, { _id: req.params.id }));
      defaultPopulate.forEach((path) => query.populate(path));
      const data = await query;
      if (!data) throw new AppError(`${Model.modelName} not found`, 404);
      res.json({ success: true, data });
    }),

    create: asyncHandler(async (req, res) => {
      const payload = { ...req.body };
      if (req.user?.hospitalId && !payload.hospitalId) payload.hospitalId = req.user.hospitalId;
      if (req.user?.id) {
        payload.createdBy = req.user.id;
        payload.updatedBy = req.user.id;
      }
      const data = await Model.create(payload);
      res.status(201).json({ success: true, data });
    }),

    update: asyncHandler(async (req, res) => {
      const data = await Model.findOneAndUpdate(tenantFilter(req, { _id: req.params.id }), { ...req.body, updatedBy: req.user?.id }, {
        new: true,
        runValidators: true
      });
      if (!data) throw new AppError(`${Model.modelName} not found`, 404);
      res.json({ success: true, data });
    }),

    remove: asyncHandler(async (req, res) => {
      const data = await Model.findOneAndUpdate(tenantFilter(req, { _id: req.params.id }), { isDeleted: true, isActive: false, updatedBy: req.user?.id }, { new: true });
      if (!data) throw new AppError(`${Model.modelName} not found`, 404);
      res.json({ success: true, data });
    })
  };
}
