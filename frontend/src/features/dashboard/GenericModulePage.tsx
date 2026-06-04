import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { SkeletonRows } from '../../components/ui/Skeleton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { pushToast } from './uiSlice';
import { api } from '../../services/api';
import { mockModuleRows } from '../../services/mockData';

type Row = Record<string, unknown> & { _id: string; status?: string; createdAt?: string };

const nextStatuses: Record<string, Record<string, string>> = {
  '/lab-reports': { requested: 'sample_collected', sample_collected: 'processing', processing: 'completed' },
  '/inventory': { purchased: 'received', received: 'dispensed', dispensed: 'billed' },
  '/admissions': { admitted: 'bed_allocated', bed_allocated: 'under_treatment', under_treatment: 'discharged' },
  '/bills': { draft: 'issued', issued: 'partially_paid', partially_paid: 'paid' }
};

export function GenericModulePage({ module, endpoint }: { module: string; endpoint: string }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get(endpoint, { params: status ? { status } : undefined });
      setRows(data.data.length ? data.data : mockModuleRows[endpoint] || []);
    } catch {
      const fallback = mockModuleRows[endpoint] || [];
      setRows(status ? fallback.filter((row) => row.status === status) : fallback);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, [endpoint]);

  async function transition(row: Row) {
    const next = nextStatuses[endpoint]?.[row.status || ''];
    if (!next) return;
    try {
      await api.patch(`${endpoint}/${row._id}/transition`, { status: next });
    } catch {
      setRows((current) => current.map((item) => item._id === row._id ? { ...item, status: next } : item));
    }
    dispatch(pushToast({ type: 'success', message: `${module} moved to ${next.split('_').join(' ')}` }));
    await load();
  }

  const columns = useMemo(() => [
    { key: '_id', header: 'ID', render: (row: Row) => row._id.slice(-8) },
    { key: 'status', header: 'Status', render: (row: Row) => <StatusBadge status={row.status} /> },
    { key: 'createdAt', header: 'Created', render: (row: Row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: Row) => {
        const next = nextStatuses[endpoint]?.[row.status || ''];
        return next ? <button className="text-brand-700" onClick={() => transition(row)}>Move to {next.split('_').join(' ')}</button> : '-';
      }
    }
  ], [endpoint, module]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{module}</h1>
          <p className="text-sm text-slate-500">Operational records, workflow state, and audit-ready history.</p>
        </div>
        <Button onClick={() => navigate(`${location.pathname}/new`)}><Plus size={16} /> New</Button>
      </div>
      <Card>
        <div className="grid gap-3 md:grid-cols-4">
          <input className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Search" />
          <select className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            <option value="requested">Requested</option>
            <option value="sample_collected">Sample collected</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
            <option value="issued">Issued</option>
            <option value="paid">Paid</option>
          </select>
          <input type="date" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
          <Button onClick={load}>Filter</Button>
        </div>
      </Card>
      {loading ? <SkeletonRows /> : <DataTable rows={rows} columns={columns} />}
    </div>
  );
}
