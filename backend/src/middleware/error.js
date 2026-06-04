import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export function notFound(req, _res, next) {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
}

export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.isOperational ? err.message : 'Internal server error'
  };

  if (err.details) payload.details = err.details;
  if (env.nodeEnv !== 'production') {
    payload.stack = err.stack;
    payload.raw = err.message;
  }

  res.status(statusCode).json(payload);
}
