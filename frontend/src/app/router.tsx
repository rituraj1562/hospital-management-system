import type { ReactElement } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../features/auth/ResetPasswordPage';
import { PendingApprovalPage } from '../features/auth/PendingApprovalPage';
import { RoleDashboardPage } from '../features/dashboard/RoleDashboardPage';
import { PatientsPage } from '../features/patients/PatientsPage';
import { AppointmentsPage } from '../features/appointments/AppointmentsPage';
import { GenericModulePage } from '../features/dashboard/GenericModulePage';
import { StaffApprovalPage } from '../features/admin/StaffApprovalPage';
import { AuditLogPage } from '../features/admin/AuditLogPage';
import { PatientProfilePage } from '../features/patients/PatientProfilePage';
import { DoctorFormPage } from '../features/doctors/DoctorFormPage';
import { LabFormPage } from '../features/laboratory/LabFormPage';
import { PharmacyFormPage } from '../features/pharmacy/PharmacyFormPage';
import { BillingFormPage } from '../features/billing/BillingFormPage';
import { InpatientFormPage } from '../features/inpatient/InpatientFormPage';
import { EmrFormPage } from '../features/emr/EmrFormPage';
import { DemoRoleSwitcherPage } from '../features/demo/DemoRoleSwitcherPage';
import { PatientTimelinePage } from '../features/patients/PatientTimelinePage';
import { DoctorAvailabilityPage } from '../features/doctors/DoctorAvailabilityPage';
import { LabReportBuilderPage } from '../features/laboratory/LabReportBuilderPage';
import { MedicineAlertsPage } from '../features/pharmacy/MedicineAlertsPage';
import { store } from './store';
import type { Role } from '../types';

function Protected({ children, roles }: { children: ReactElement; roles?: Role[] }) {
  const auth = store.getState().auth;
  if (!auth.accessToken) return <Navigate to="/login" replace />;
  if (auth.user?.approvalStatus === 'pending') return <Navigate to="/pending-approval" replace />;
  if (roles?.length && auth.user && !roles.includes(auth.user.role)) return <Navigate to="/" replace />;
  return children;
}

const staffRoles: Role[] = ['super_admin', 'hospital_admin', 'doctor', 'receptionist', 'pharmacist', 'laboratory_technician'];
const adminRoles: Role[] = ['super_admin', 'hospital_admin'];
const clinicalOrPatientRoles: Role[] = [...staffRoles, 'patient'];
const billingRoles: Role[] = ['super_admin', 'hospital_admin', 'receptionist', 'pharmacist', 'patient'];

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password/:token', element: <ResetPasswordPage /> },
  { path: '/pending-approval', element: <PendingApprovalPage /> },
  {
    path: '/',
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [
      { index: true, element: <RoleDashboardPage /> },
      { path: 'demo-roles', element: <DemoRoleSwitcherPage /> },
      { path: 'patients', element: <Protected roles={clinicalOrPatientRoles}><PatientsPage /></Protected> },
      { path: 'patients/:id', element: <Protected roles={clinicalOrPatientRoles}><PatientProfilePage /></Protected> },
      { path: 'patient-timeline', element: <Protected roles={clinicalOrPatientRoles}><PatientTimelinePage /></Protected> },
      { path: 'appointments', element: <Protected roles={clinicalOrPatientRoles}><AppointmentsPage /></Protected> },
      { path: 'doctors', element: <Protected roles={clinicalOrPatientRoles}><GenericModulePage module="Doctors" endpoint="/doctors" /></Protected> },
      { path: 'doctors/new', element: <Protected roles={adminRoles}><DoctorFormPage /></Protected> },
      { path: 'doctor-availability', element: <Protected roles={clinicalOrPatientRoles}><DoctorAvailabilityPage /></Protected> },
      { path: 'emr', element: <Protected roles={clinicalOrPatientRoles}><GenericModulePage module="Electronic Medical Records" endpoint="/medical-records" /></Protected> },
      { path: 'emr/new', element: <Protected roles={[...adminRoles, 'doctor']}><EmrFormPage /></Protected> },
      { path: 'laboratory', element: <Protected roles={clinicalOrPatientRoles}><GenericModulePage module="Laboratory" endpoint="/lab-reports" /></Protected> },
      { path: 'laboratory/new', element: <Protected roles={[...adminRoles, 'doctor', 'laboratory_technician']}><LabFormPage /></Protected> },
      { path: 'lab-builder', element: <Protected roles={clinicalOrPatientRoles}><LabReportBuilderPage /></Protected> },
      { path: 'pharmacy', element: <Protected roles={clinicalOrPatientRoles}><GenericModulePage module="Pharmacy Inventory" endpoint="/inventory" /></Protected> },
      { path: 'pharmacy/new', element: <Protected roles={[...adminRoles, 'pharmacist']}><PharmacyFormPage /></Protected> },
      { path: 'medicine-alerts', element: <Protected roles={clinicalOrPatientRoles}><MedicineAlertsPage /></Protected> },
      { path: 'inpatient', element: <Protected roles={clinicalOrPatientRoles}><GenericModulePage module="Inpatient Management" endpoint="/admissions" /></Protected> },
      { path: 'inpatient/new', element: <Protected roles={staffRoles}><InpatientFormPage /></Protected> },
      { path: 'billing', element: <Protected roles={billingRoles}><GenericModulePage module="Billing & Payments" endpoint="/bills" /></Protected> },
      { path: 'billing/new', element: <Protected roles={billingRoles}><BillingFormPage /></Protected> },
      { path: 'staff-approvals', element: <Protected roles={adminRoles}><StaffApprovalPage /></Protected> },
      { path: 'audit-logs', element: <Protected roles={adminRoles}><AuditLogPage /></Protected> }
    ]
  }
]);
