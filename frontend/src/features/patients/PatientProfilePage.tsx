import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { mockAppointments, mockModuleRows, mockPatients } from '../../services/mockData';

const tabs = ['Overview', 'Appointments', 'Prescriptions', 'Lab Reports', 'Bills', 'Medical History', 'Documents'];

export function PatientProfilePage() {
  const { id } = useParams();
  const [tab, setTab] = useState('Overview');
  const patient = useMemo(() => mockPatients.find((item) => item._id === id) || mockPatients[0], [id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{patient.firstName} {patient.lastName}</h1>
        <p className="text-sm text-slate-500">{patient.mrn} · {patient.bloodGroup} · {patient.phone}</p>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((item) => (
          <button key={item} onClick={() => setTab(item)} className={`h-10 whitespace-nowrap rounded-md border px-4 text-sm font-semibold ${tab === item ? 'bg-brand-600 text-white' : 'bg-white dark:bg-slate-900'}`}>
            {item}
          </button>
        ))}
      </div>
      {tab === 'Overview' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card><p className="text-sm text-slate-500">Email</p><p className="mt-2 font-semibold">{patient.email}</p></Card>
          <Card><p className="text-sm text-slate-500">Emergency Contact</p><p className="mt-2 font-semibold">Ramesh Pandey · Father · 9876500000</p></Card>
          <Card><p className="text-sm text-slate-500">Insurance</p><p className="mt-2 font-semibold">Care Health · CH-92818</p></Card>
        </div>
      )}
      {tab === 'Appointments' && <DataTable rows={mockAppointments} columns={[{ key: 'date', header: 'Date', render: (row) => new Date(row.scheduledAt).toLocaleString() }, { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> }, { key: 'reason', header: 'Reason', render: (row) => row.reason || '-' }]} />}
      {tab === 'Lab Reports' && <DataTable rows={mockModuleRows['/lab-reports']} columns={[{ key: 'id', header: 'Report', render: (row) => row._id }, { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> }, { key: 'test', header: 'Test', render: (row) => String(row.testName || '-') }]} />}
      {tab === 'Bills' && <DataTable rows={mockModuleRows['/bills']} columns={[{ key: 'id', header: 'Bill', render: (row) => row._id }, { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> }, { key: 'amount', header: 'Amount', render: (row) => `Rs. ${String(row.totalAmount || 0)}` }]} />}
      {['Prescriptions', 'Medical History', 'Documents'].includes(tab) && (
        <Card>
          <p className="font-semibold">{tab}</p>
          <p className="mt-2 text-sm text-slate-500">Demo records are ready to connect to backend collections for this patient.</p>
        </Card>
      )}
    </div>
  );
}
