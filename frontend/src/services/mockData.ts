import type { Appointment, Patient } from '../types';

export const mockPatients: Patient[] = [
  {
    _id: 'pat_1001',
    mrn: 'MRN-1001',
    firstName: 'Ankit',
    lastName: 'Pandey',
    phone: '9876543210',
    email: 'ankit.patient@demo-hms.local',
    bloodGroup: 'B+',
    gender: 'male'
  },
  {
    _id: 'pat_1002',
    mrn: 'MRN-1002',
    firstName: 'Priya',
    lastName: 'Nair',
    phone: '9876543211',
    email: 'priya.nair@demo-hms.local',
    bloodGroup: 'O+',
    gender: 'female'
  },
  {
    _id: 'pat_1003',
    mrn: 'MRN-1003',
    firstName: 'Rahul',
    lastName: 'Verma',
    phone: '9876543212',
    email: 'rahul.verma@demo-hms.local',
    bloodGroup: 'A-',
    gender: 'male'
  },
  {
    _id: 'pat_1004',
    mrn: 'MRN-1004',
    firstName: 'Sara',
    lastName: 'Khan',
    phone: '9876543213',
    email: 'sara.khan@demo-hms.local',
    bloodGroup: 'AB+',
    gender: 'female'
  }
];

export const mockAppointments: Appointment[] = [
  {
    _id: 'apt_2001',
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'booked',
    reason: 'Cardiology consultation',
    patientId: mockPatients[0]
  },
  {
    _id: 'apt_2002',
    scheduledAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    status: 'checked_in',
    reason: 'Follow-up review',
    patientId: mockPatients[1]
  },
  {
    _id: 'apt_2003',
    scheduledAt: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    status: 'in_consultation',
    reason: 'Fever and fatigue',
    patientId: mockPatients[2]
  },
  {
    _id: 'apt_2004',
    scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    reason: 'Routine health check',
    patientId: mockPatients[3]
  }
];

export const mockDashboard = {
  metrics: {
    totalPatients: 1284,
    totalDoctors: 42,
    dailyAppointments: 36,
    revenue: 842500
  },
  occupancy: [
    { _id: 'available', count: 68 },
    { _id: 'occupied', count: 91 },
    { _id: 'maintenance', count: 7 },
    { _id: 'reserved', count: 13 }
  ]
};

export const mockModuleRows: Record<string, Array<Record<string, unknown> & { _id: string; status?: string; createdAt?: string }>> = {
  '/doctors': [
    { _id: 'doc_3001', status: 'approved', createdAt: new Date().toISOString(), name: 'Dr. Meera Sharma', department: 'Cardiology' },
    { _id: 'doc_3002', status: 'approved', createdAt: new Date().toISOString(), name: 'Dr. Karan Shah', department: 'Orthopedics' },
    { _id: 'doc_3003', status: 'pending', createdAt: new Date().toISOString(), name: 'Dr. Nidhi Rao', department: 'Pediatrics' }
  ],
  '/medical-records': [
    { _id: 'emr_4001', status: 'completed', createdAt: new Date().toISOString(), diagnosis: 'Hypertension follow-up' },
    { _id: 'emr_4002', status: 'draft', createdAt: new Date().toISOString(), diagnosis: 'Viral fever' }
  ],
  '/lab-reports': [
    { _id: 'lab_5001', status: 'requested', createdAt: new Date().toISOString(), testName: 'CBC' },
    { _id: 'lab_5002', status: 'sample_collected', createdAt: new Date().toISOString(), testName: 'Lipid Profile' },
    { _id: 'lab_5003', status: 'processing', createdAt: new Date().toISOString(), testName: 'Liver Function Test' }
  ],
  '/inventory': [
    { _id: 'inv_6001', status: 'received', createdAt: new Date().toISOString(), medicine: 'Paracetamol 500mg' },
    { _id: 'inv_6002', status: 'dispensed', createdAt: new Date().toISOString(), medicine: 'Amoxicillin 250mg' },
    { _id: 'inv_6003', status: 'purchased', createdAt: new Date().toISOString(), medicine: 'Pantoprazole 40mg' }
  ],
  '/admissions': [
    { _id: 'adm_7001', status: 'admitted', createdAt: new Date().toISOString(), ward: 'General' },
    { _id: 'adm_7002', status: 'bed_allocated', createdAt: new Date().toISOString(), ward: 'ICU' },
    { _id: 'adm_7003', status: 'under_treatment', createdAt: new Date().toISOString(), ward: 'Private' }
  ],
  '/bills': [
    { _id: 'bil_8001', status: 'draft', createdAt: new Date().toISOString(), totalAmount: 1800 },
    { _id: 'bil_8002', status: 'issued', createdAt: new Date().toISOString(), totalAmount: 5600 },
    { _id: 'bil_8003', status: 'partially_paid', createdAt: new Date().toISOString(), totalAmount: 12400 }
  ]
};

export const mockDoctors = [
  { _id: 'doc_3001', name: 'Dr. Meera Sharma', specialization: 'Cardiology', fee: 800 },
  { _id: 'doc_3002', name: 'Dr. Karan Shah', specialization: 'Orthopedics', fee: 700 },
  { _id: 'doc_3003', name: 'Dr. Nidhi Rao', specialization: 'Pediatrics', fee: 600 }
];

export const mockSlots = ['09:00', '09:20', '09:40', '10:00', '10:20', '11:00', '12:00', '14:00'];

export const demoUsers = [
  { id: 'demo_admin', name: 'Asha Admin', email: 'admin@demo-hms.local', role: 'hospital_admin', approvalStatus: 'approved', emailVerified: true },
  { id: 'demo_doctor', name: 'Dr. Meera Sharma', email: 'doctor@demo-hms.local', role: 'doctor', approvalStatus: 'approved', emailVerified: true },
  { id: 'demo_patient', name: 'Ankit Pandey', email: 'patient@demo-hms.local', role: 'patient', approvalStatus: 'approved', emailVerified: true },
  { id: 'demo_pharmacist', name: 'Aman Pharmacy', email: 'pharmacy@demo-hms.local', role: 'pharmacist', approvalStatus: 'approved', emailVerified: true },
  { id: 'demo_lab', name: 'Nisha Lab', email: 'lab@demo-hms.local', role: 'laboratory_technician', approvalStatus: 'approved', emailVerified: true }
] as const;

export const mockTimeline = [
  { id: 'tl_1', date: '2026-06-01', type: 'Appointment', title: 'Cardiology consultation', detail: 'Checked in and completed by Dr. Meera Sharma' },
  { id: 'tl_2', date: '2026-06-01', type: 'Diagnosis', title: 'Hypertension follow-up', detail: 'BP monitored, lifestyle advice recorded' },
  { id: 'tl_3', date: '2026-06-01', type: 'Prescription', title: 'Amlodipine 5mg', detail: 'Once daily for 30 days' },
  { id: 'tl_4', date: '2026-06-02', type: 'Lab', title: 'CBC requested', detail: 'Sample collected, report processing' },
  { id: 'tl_5', date: '2026-06-03', type: 'Bill', title: 'Invoice issued', detail: 'Consultation and lab charges generated' }
];

export const mockDoctorAvailability = [
  { day: 'Monday', slots: ['09:00', '09:20', '10:00', '11:00'], blocked: ['09:40'] },
  { day: 'Tuesday', slots: ['10:00', '10:20', '12:00', '14:00'], blocked: [] },
  { day: 'Wednesday', slots: ['09:00', '09:20', '09:40', '10:00'], blocked: ['10:00'] },
  { day: 'Thursday', slots: ['11:00', '11:20', '12:00', '15:00'], blocked: [] },
  { day: 'Friday', slots: ['09:00', '10:00', '11:00', '12:00'], blocked: ['12:00'] }
];

export const mockLabParameters = [
  { parameter: 'Hemoglobin', value: '13.8', unit: 'g/dL', referenceRange: '13.0-17.0', flag: 'normal' },
  { parameter: 'WBC Count', value: '11,200', unit: '/cmm', referenceRange: '4,000-10,000', flag: 'high' },
  { parameter: 'Platelets', value: '1.9', unit: 'lakh/cmm', referenceRange: '1.5-4.5', flag: 'normal' }
];

export const mockStockAlerts = [
  { id: 'med_1', name: 'Paracetamol 500mg', stock: 34, reorderLevel: 50, expiry: '2026-07-15', risk: 'low_stock' },
  { id: 'med_2', name: 'Amoxicillin 250mg', stock: 18, reorderLevel: 40, expiry: '2026-06-25', risk: 'expiring_soon' },
  { id: 'med_3', name: 'Pantoprazole 40mg', stock: 120, reorderLevel: 30, expiry: '2026-11-02', risk: 'healthy' },
  { id: 'med_4', name: 'Insulin Regular', stock: 8, reorderLevel: 20, expiry: '2026-06-18', risk: 'critical' }
];
