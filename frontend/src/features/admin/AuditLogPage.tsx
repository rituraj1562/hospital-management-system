import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { api } from '../../services/api';

type AuditLog = { _id: string; action: string; resource: string; actorRole?: string; createdAt: string };

const fallbackLogs: AuditLog[] = [
  { _id: 'aud_1', action: 'PATCH /appointments/apt_2001/transition', resource: 'appointments', actorRole: 'doctor', createdAt: new Date().toISOString() },
  { _id: 'aud_2', action: 'POST /patients', resource: 'patients', actorRole: 'receptionist', createdAt: new Date().toISOString() },
  { _id: 'aud_3', action: 'PATCH /bills/bil_8002/transition', resource: 'bills', actorRole: 'hospital_admin', createdAt: new Date().toISOString() }
];

export function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>(fallbackLogs);

  useEffect(() => {
    api.get('/audit-logs').then(({ data }) => setLogs(data.data.length ? data.data : fallbackLogs)).catch(() => setLogs(fallbackLogs));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-sm text-slate-500">Track who changed what and when.</p>
      </div>
      <Card>
        <DataTable
          rows={logs}
          columns={[
            { key: 'action', header: 'Action', render: (row) => row.action },
            { key: 'resource', header: 'Resource', render: (row) => row.resource },
            { key: 'role', header: 'Actor Role', render: (row) => row.actorRole || '-' },
            { key: 'time', header: 'Time', render: (row) => new Date(row.createdAt).toLocaleString() }
          ]}
        />
      </Card>
    </div>
  );
}
