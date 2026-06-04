import mongoose from 'mongoose';
import { app } from '../backend/src/app.js';
import { connectDatabase } from '../backend/src/config/db.js';

let databaseConnection;

async function ensureDatabaseConnection() {
  if (mongoose.connection.readyState === 1) return;
  databaseConnection ||= connectDatabase();
  await databaseConnection;
}

export default async function handler(req, res) {
  if (req.url === '/health') {
    return res.status(200).json({
      status: 'ok',
      runtime: 'vercel',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'not_connected'
    });
  }

  await ensureDatabaseConnection();
  return app(req, res);
}
