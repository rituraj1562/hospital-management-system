import { Activity, CalendarDays, ClipboardCheck, FlaskConical, Pill, ReceiptText, UserCheck, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAppSelector } from '../../app/hooks';
import { mockAppointments, mockModuleRows } from '../../services/mockData';
import { Button } from '../../components/ui/Button';

const dashboardByRole = {
  super_admin: {
    title: 'Admin Command Center',
    cards: [['Patients', '1,284', Users], ['Doctors', '42', UserCheck], ['Appointments Today', '36', CalendarDays], ['Revenue', 'Rs. 8.4L', ReceiptText]],
    focus: ['Approve staff accounts', 'Monitor revenue and bed occupancy', 'Review audit activity']
  },
  hospital_admin: {
    title: 'Hospital Admin Dashboard',
    cards: [['Admissions', '18', Activity], ['Pending Staff', '3', UserCheck], ['Open Bills', '12', ReceiptText], ['Lab Queue', '21', FlaskConical]],
    focus: ['Bed allocation', 'Billing exceptions', 'Staff approvals']
  },
  doctor: {
    title: 'Doctor Workspace',
    cards: [['Today Appointments', '9', CalendarDays], ['Waiting', '4', Users], ['Reports Ready', '6', FlaskConical], ['Prescriptions', '14', ClipboardCheck]],
    focus: ['Review patient history', 'Complete consultations', 'Issue prescriptions']
  },
  receptionist: {
    title: 'Front Desk Dashboard',
    cards: [['Check-ins', '11', UserCheck], ['Bookings', '26', CalendarDays], ['Admissions', '5', Activity], ['Payments', '8', ReceiptText]],
    focus: ['Register patients', 'Check in arrivals', 'Collect payments']
  },
  pharmacist: {
    title: 'Pharmacy Dashboard',
    cards: [['Pending Dispense', '17', Pill], ['Low Stock', '9', Activity], ['Expired Soon', '4', ClipboardCheck], ['Sales', 'Rs. 42K', ReceiptText]],
    focus: ['Dispense prescriptions', 'Track stock', 'Raise purchase records']
  },
  laboratory_technician: {
    title: 'Laboratory Dashboard',
    cards: [['Requested', '15', FlaskConical], ['Collected', '7', ClipboardCheck], ['Processing', '5', Activity], ['Completed', '22', UserCheck]],
    focus: ['Collect samples', 'Upload reports', 'Notify doctors']
  },
  patient: {
    title: 'Patient Dashboard',
    cards: [['Upcoming', '2', CalendarDays], ['Prescriptions', '5', ClipboardCheck], ['Reports', '3', FlaskConical], ['Bills', '2', ReceiptText]],
    focus: ['View appointments', 'Download reports', 'Track bills']
  }
} as const;

export function RoleDashboardPage() {
  const navigate = useNavigate();
  const role = useAppSelector((state) => state.auth.user?.role || 'patient');
  const config = dashboardByRole[role];
  const recentQueue = [
    ...mockAppointments.slice(0, 2).map((item) => ({ id: item._id, label: item.reason || 'Appointment', status: item.status })),
    ...mockModuleRows['/lab-reports'].slice(0, 2).map((item) => ({ id: item._id, label: String(item.testName || item._id), status: item.status }))
  ];

  const queueRouteByRole = {
    super_admin: '/staff-approvals',
    hospital_admin: '/staff-approvals',
    doctor: '/appointments',
    receptionist: '/appointments',
    pharmacist: '/pharmacy',
    laboratory_technician: '/laboratory',
    patient: '/appointments'
  };

  function openWorkQueue() {
    navigate(queueRouteByRole[role]);
  }

  function exportReport() {
    const rows = [
      ['Dashboard', config.title],
      ['Generated At', new Date().toLocaleString()],
      ['Role', role],
      [],
      ['Metric', 'Value'],
      ...config.cards.map(([label, value]) => [label, value]),
      [],
      ['Priority Work', 'Status'],
      ...config.focus.map((item) => [item, 'Pending']),
      [],
      ['Recent Queue', 'Status'],
      ...recentQueue.map((item) => [item.label, item.status || ''])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `hms-${role}-dashboard-report.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-[var(--panel-shadow)] backdrop-blur">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <div className="inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--accent-strong)]">
              Live command view
            </div>
            <h1 className="mt-4 text-3xl font-bold">{config.title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">Role-specific queues, operational alerts, handoffs, and next actions for today’s hospital flow.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={openWorkQueue}>Open Work Queue</Button>
              <button onClick={exportReport} className="h-[var(--control-h)] rounded-lg border border-[var(--line)] bg-white/70 px-4 text-sm font-semibold dark:bg-slate-900/70">Export Report</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['OPD', 'IPD', 'Lab', 'Billing'].map((label, index) => (
              <div key={label} className="rounded-xl border border-[var(--line)] bg-white/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold">{[82, 64, 71, 93][index]}%</p>
                <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-2 rounded-full bg-[var(--accent)]" style={{ width: `${[82, 64, 71, 93][index]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {config.cards.map(([label, value, Icon]) => (
          <Card key={label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold">{value}</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-strong)] ring-1 ring-[var(--accent-ring)]">
                <Icon size={21} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-base font-semibold">Priority Work</h2>
          <div className="space-y-3">
            {config.focus.map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-white/55 p-3 dark:bg-slate-950/40">
                <span className="text-sm">{item}</span>
                <StatusBadge status="pending" />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-base font-semibold">Recent Queue</h2>
          <div className="space-y-3">
            {recentQueue.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-white/55 p-3 text-sm dark:bg-slate-950/40">
                <span>{item.label}</span>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
