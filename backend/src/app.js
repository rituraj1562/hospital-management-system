import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import routes from './routes/index.js';
import { apiRateLimiter, corsMiddleware, helmetMiddleware, hppMiddleware, sanitizeMiddleware } from './middleware/security.js';
import { errorHandler, notFound } from './middleware/error.js';
import { env } from './config/env.js';
import { attachAuditContext } from './middleware/audit.js';

export const app = express();

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeMiddleware);
app.use(hppMiddleware);
app.use(apiRateLimiter);
if (env.nodeEnv !== 'test') app.use(morgan('dev'));
app.use(attachAuditContext);

app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.use('/api/v1', routes);
app.use(notFound);
app.use(errorHandler);
