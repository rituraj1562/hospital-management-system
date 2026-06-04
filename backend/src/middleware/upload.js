import multer from 'multer';
import { AppError } from '../utils/AppError.js';

const allowedMimeTypes = new Set(['image/png', 'image/jpeg', 'image/webp', 'application/pdf']);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new AppError('Only PNG, JPG, WEBP, and PDF files are allowed', 422));
      return;
    }
    cb(null, true);
  }
});
