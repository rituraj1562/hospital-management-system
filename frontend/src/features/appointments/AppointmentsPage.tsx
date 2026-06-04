import { FormEvent, useEffect, useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { useAppDispatch } from '../../app/hooks';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { SkeletonRows } from '../../components/ui/Skeleton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { pushToast } from '../dashboard/uiSlice';
import { api } from '../../services/api';
import { mockAppointments, mockDoctors, mockPatients, mockSlots } from '../../services/mockData';
import type { Appointment } from '../../types';

export function AppointmentsPage() {
  const dispatch = useAppDispatch();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(mockDoctors[0]._id);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedSlot, setSelectedSlot] = useState(mockSlots[0]);

  const conflict = appointments.some((appointment) => {
    const scheduled = new Date(appointment.scheduledAt);
    return scheduled.toISOString().slice(0, 10) === selectedDate && scheduled.toTimeString().slice(0, 5) === selectedSlot && appointment.status !== 'cancelled';
  });

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data.data.length ? data.data : mockAppointments);
    } catch {
      setAppointments(mockAppointments);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);

  async function book(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    const scheduledAt = new Date(`${selectedDate}T${selectedSlot}:00`).toISOString();
    try {
      await api.post('/appointments', { ...payload, doctorId: selectedDoctor, scheduledAt });
    } catch {
      setAppointments((current) => [{
        _id: `apt_${Date.now()}`,
        scheduledAt,
        status: 'booked',
        patientId: mockPatients.find((patient) => patient._id === payload.patientId),
        reason: String(payload.reason || 'New appointment')
      }, ...current]);
    }
    event.currentTarget.reset();
    dispatch(pushToast({ type: 'success', message: 'Appointment booked' }));
    await load();
  }

  async function transition(id: string, status: string) {
    try {
      await api.patch(`/appointments/${id}/transition`, { status });
    } catch {
      setAppointments((current) => current.map((appointment) => appointment._id === id ? { ...appointment, status } : appointment));
    }
    dispatch(pushToast({ type: 'success', message: `Appointment moved to ${status.split('_').join(' ')}` }));
    await load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Appointment Management</h1>
        <p className="text-sm text-slate-500">Booking, rescheduling, cancellation, and status tracking.</p>
      </div>
      <Card>
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold"><CalendarClock size={18} /> Book Appointment</h2>
        <form onSubmit={book} className="grid gap-3 md:grid-cols-5">
          <select name="patientId" required className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950">
            {mockPatients.map((patient) => <option key={patient._id} value={patient._id}>{patient.firstName} {patient.lastName} · {patient.mrn}</option>)}
          </select>
          <select name="doctorId" required value={selectedDoctor} onChange={(event) => setSelectedDoctor(event.target.value)} className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950">
            {mockDoctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name} · {doctor.specialization}</option>)}
          </select>
          <input value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} required type="date" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
          <select value={selectedSlot} onChange={(event) => setSelectedSlot(event.target.value)} className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950">
            {mockSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
          </select>
          <input name="reason" className="h-10 rounded-md border px-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Reason" />
          {conflict && <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700 md:col-span-4">This slot may already be booked. Choose another slot to avoid conflict.</p>}
          <Button disabled={conflict}>Book</Button>
        </form>
      </Card>
      <Card>
        <h2 className="mb-4 text-base font-semibold">Calendar View</h2>
        <div className="grid gap-3 md:grid-cols-7">
          {appointments.slice(0, 7).map((appointment) => (
            <div key={appointment._id} className="rounded-md border border-slate-200 p-3 text-sm dark:border-slate-800">
              <p className="font-semibold">{new Date(appointment.scheduledAt).toLocaleDateString()}</p>
              <p className="mt-1 text-slate-500">{new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <div className="mt-2"><StatusBadge status={appointment.status} /></div>
            </div>
          ))}
        </div>
      </Card>
      {loading ? <SkeletonRows /> : (
        <DataTable
          rows={appointments}
          columns={[
            { key: 'date', header: 'Date', render: (row) => new Date(row.scheduledAt).toLocaleString() },
            { key: 'patient', header: 'Patient', render: (row) => row.patientId ? `${row.patientId.firstName} ${row.patientId.lastName}` : '-' },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'reason', header: 'Reason', render: (row) => row.reason || '-' },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <div className="flex gap-2">
                  {row.status === 'booked' && <button className="text-brand-700" onClick={() => transition(row._id, 'checked_in')}>Check in</button>}
                  {row.status === 'checked_in' && <button className="text-brand-700" onClick={() => transition(row._id, 'in_consultation')}>Consult</button>}
                  {row.status === 'in_consultation' && <button className="text-brand-700" onClick={() => transition(row._id, 'completed')}>Complete</button>}
                </div>
              )
            }
          ]}
        />
      )}
    </div>
  );
}
