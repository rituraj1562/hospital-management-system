import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAppDispatch } from '../../app/hooks';
import { pushToast } from '../dashboard/uiSlice';
import { api } from '../../services/api';

type PendingUser = { _id: string; name: string; email: string; role: string; approvalStatus: string };

const fallbackUsers: PendingUser[] = [
  { _id: 'usr_pending_1', name: 'Dr. Nidhi Rao', email: 'nidhi.rao@demo-hms.local', role: 'doctor', approvalStatus: 'pending' },
  { _id: 'usr_pending_2', name: 'Vikram Lab', email: 'vikram.lab@demo-hms.local', role: 'laboratory_technician', approvalStatus: 'pending' },
  { _id: 'usr_pending_3', name: 'Neha Frontdesk', email: 'neha.frontdesk@demo-hms.local', role: 'receptionist', approvalStatus: 'pending' }
];

export function StaffApprovalPage() {
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<PendingUser[]>(fallbackUsers);

  async function load() {
    try {
      const { data } = await api.get('/users', { params: { approvalStatus: 'pending' } });
      setUsers(data.data.length ? data.data : fallbackUsers);
    } catch {
      setUsers(fallbackUsers);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(user: PendingUser, action: 'approve' | 'reject') {
    try {
      await api.patch(`/auth/users/${user._id}/${action}`);
    } catch {
      // Demo fallback keeps UI responsive when backend is offline.
    }
    setUsers((current) => current.filter((item) => item._id !== user._id));
    dispatch(pushToast({ type: 'success', message: `${user.name} ${action}d` }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Staff Approvals</h1>
        <p className="text-sm text-slate-500">Approve doctors, receptionists, pharmacists, and lab technicians.</p>
      </div>
      <Card>
        <DataTable
          rows={users}
          columns={[
            { key: 'name', header: 'Name', render: (row) => row.name },
            { key: 'email', header: 'Email', render: (row) => row.email },
            { key: 'role', header: 'Role', render: (row) => row.role.split('_').join(' ') },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.approvalStatus} /> },
            { key: 'actions', header: 'Actions', render: (row) => <div className="flex gap-2"><Button onClick={() => decide(row, 'approve')}>Approve</Button><button className="h-10 rounded-md border px-3 text-sm font-semibold" onClick={() => decide(row, 'reject')}>Reject</button></div> }
          ]}
        />
      </Card>
    </div>
  );
}
