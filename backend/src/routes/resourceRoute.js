import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { mongoIdParam } from '../validators/domainValidators.js';

export function resourceRoute(controller, allowedRoles, createRules = []) {
  const router = Router();
  router.use(authenticate);
  router.get('/', authorize(...allowedRoles.read), controller.list);
  router.post('/', authorize(...allowedRoles.write), createRules, validate, controller.create);
  router.get('/:id', authorize(...allowedRoles.read), mongoIdParam, validate, controller.get);
  router.patch('/:id', authorize(...allowedRoles.write), mongoIdParam, validate, controller.update);
  router.delete('/:id', authorize(...allowedRoles.admin), mongoIdParam, validate, controller.remove);
  return router;
}
