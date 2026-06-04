import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../app.js';
import { Hospital } from '../models/Hospital.js';
import { User } from '../models/User.js';
import { Patient } from '../models/Patient.js';
import { Doctor } from '../models/Doctor.js';
import { Appointment } from '../models/Appointment.js';
import { roles } from '../utils/roles.js';
import { signAccessToken } from '../utils/tokens.js';

let mongo;
let hospital;
let admin;
let doctor;
let patient;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create({ instance: { ip: '127.0.0.1' } });
  await mongoose.connect(mongo.getUri());
  hospital = await Hospital.create({ name: 'Test Hospital', code: 'TEST' });
  admin = await User.create({ name: 'Admin', email: 'admin@test.local', password: 'Password123', role: roles.HOSPITAL_ADMIN, hospitalId: hospital.id });
  const doctorUser = await User.create({ name: 'Doctor', email: 'doctor@test.local', password: 'Password123', role: roles.DOCTOR, hospitalId: hospital.id });
  doctor = await Doctor.create({ hospitalId: hospital.id, userId: doctorUser.id, employeeCode: 'D-1', specialization: 'Cardiology' });
  patient = await Patient.create({ hospitalId: hospital.id, mrn: 'T-1', firstName: 'Test', lastName: 'Patient' });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

function bearer(user) {
  return `Bearer ${signAccessToken(user)}`;
}

describe('auth and RBAC', () => {
  it('logs in a seeded user', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@test.local', password: 'Password123' });
    expect(res.status).toBe(200);
    expect(res.body.data.user.role).toBe(roles.HOSPITAL_ADMIN);
  });

  it('blocks protected resources without a token', async () => {
    const res = await request(app).get('/api/v1/patients');
    expect(res.status).toBe(401);
  });
});

describe('appointment workflow', () => {
  it('moves a booked appointment to checked in', async () => {
    const appointment = await Appointment.create({
      hospitalId: hospital.id,
      patientId: patient.id,
      doctorId: doctor.id,
      scheduledAt: new Date(Date.now() + 3600000),
      status: 'booked'
    });

    const res = await request(app)
      .patch(`/api/v1/appointments/${appointment.id}/transition`)
      .set('Authorization', bearer(admin))
      .send({ status: 'checked_in' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('checked_in');
  });
});
