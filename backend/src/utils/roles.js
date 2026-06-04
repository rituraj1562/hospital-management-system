export const roles = Object.freeze({
  SUPER_ADMIN: 'super_admin',
  HOSPITAL_ADMIN: 'hospital_admin',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
  PHARMACIST: 'pharmacist',
  LAB_TECH: 'laboratory_technician',
  PATIENT: 'patient'
});

export const allRoles = Object.values(roles);

export const adminRoles = [roles.SUPER_ADMIN, roles.HOSPITAL_ADMIN];
export const clinicalRoles = [roles.DOCTOR, roles.LAB_TECH];
