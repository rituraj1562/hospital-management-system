import { FormEvent, useEffect, useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { useAppDispatch } from '../../app/hooks';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { SkeletonRows } from '../../components/ui/Skeleton';
import { pushToast } from '../dashboard/uiSlice';
import { api } from '../../services/api';
import { mockPatients } from '../../services/mockData';
import type { Patient } from '../../types';

function formEntriesToNested(form: HTMLFormElement) {
  const output: Record<string, unknown> = {};
  for (const [key, value] of new FormData(form).entries()) {
    if (!String(value)) continue;
    const parts = key.split('.');
    let cursor = output;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) cursor[part] = value;
      else {
        cursor[part] = (cursor[part] || {}) as Record<string, unknown>;
        cursor = cursor[part] as Record<string, unknown>;
      }
    });
  }
  return output;
}

export function PatientsPage() {
  const dispatch = useAppDispatch();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get('/patients', { params: search ? { search } : undefined });
      setPatients(data.data.length ? data.data : mockPatients);
    } catch {
      const query = search.trim().toLowerCase();
      setPatients(query ? mockPatients.filter((patient) => `${patient.mrn} ${patient.firstName} ${patient.lastName} ${patient.phone}`.toLowerCase().includes(query)) : mockPatients);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);

  async function addPatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = formEntriesToNested(event.currentTarget);
    try {
      await api.post('/patients', payload);
    } catch {
      setPatients((current) => [{ _id: `pat_${Date.now()}`, ...(payload as Omit<Patient, '_id'>) }, ...current]);
    }
    event.currentTarget.reset();
    dispatch(pushToast({ type: 'success', message: 'Patient profile created' }));
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Patient Management</h1>
          <p className="text-sm text-slate-500">Profiles, medical history, emergency contact, and insurance details.</p>
        </div>
        <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); load(); }}>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input className="h-10 rounded-md border border-slate-300 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search patient" />
          </div>
          <Button>Search</Button>
        </form>
      </div>
      <Card>
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold"><UserPlus size={18} /> Add Patient</h2>
        <form onSubmit={addPatient} className="space-y-5">
          <section>
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Personal information</p>
            <div className="grid gap-3 md:grid-cols-4">
              <input name="mrn" required className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="MRN" />
              <input name="firstName" required className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="First name" />
              <input name="lastName" required className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Last name" />
              <input name="phone" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Phone" />
              <input name="email" type="email" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Email" />
              <select name="gender" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950">
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input name="bloodGroup" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Blood group" />
            </div>
          </section>
          <section>
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Emergency contact</p>
            <div className="grid gap-3 md:grid-cols-3">
              <input name="emergencyContact.name" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Contact name" />
              <input name="emergencyContact.relationship" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Relationship" />
              <input name="emergencyContact.phone" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Contact phone" />
            </div>
          </section>
          <section>
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Insurance</p>
            <div className="grid gap-3 md:grid-cols-4">
              <input name="insurance.provider" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Provider" />
              <input name="insurance.policyNumber" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Policy number" />
              <input name="insurance.coverageAmount" type="number" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Coverage amount" />
              <Button>Add Patient</Button>
            </div>
          </section>
        </form>
      </Card>
      {loading ? <SkeletonRows /> : (
        <DataTable
          rows={patients}
          columns={[
            { key: 'mrn', header: 'MRN', render: (row) => row.mrn },
            { key: 'name', header: 'Name', render: (row) => `${row.firstName} ${row.lastName}` },
            { key: 'phone', header: 'Phone', render: (row) => row.phone || '-' },
            { key: 'blood', header: 'Blood', render: (row) => row.bloodGroup || '-' },
            { key: 'gender', header: 'Gender', render: (row) => row.gender || '-' }
          ]}
        />
      )}
    </div>
  );
}
