export type Role =
  | 'super_admin'
  | 'hospital_admin'
  | 'doctor'
  | 'receptionist'
  | 'pharmacist'
  | 'laboratory_technician'
  | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  emailVerified?: boolean;
  hospitalId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

export interface Patient {
  _id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  bloodGroup?: string;
  gender?: string;
}

export interface Appointment {
  _id: string;
  scheduledAt: string;
  status: string;
  reason?: string;
  patientId?: Patient;
}
