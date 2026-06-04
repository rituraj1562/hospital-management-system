import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { mockPatients, mockTimeline } from '../../services/mockData';

export function PatientTimelinePage() {
  const patient = mockPatients[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Patient Timeline</h1>
        <p className="text-sm text-slate-500">{patient.firstName} {patient.lastName} · visits, diagnosis, prescriptions, labs, bills, and documents.</p>
      </div>
      <Card>
        <div className="space-y-5">
          {mockTimeline.map((event, index) => (
            <div key={event.id} className="grid grid-cols-[120px_1fr] gap-4">
              <div className="text-sm text-slate-500">{event.date}</div>
              <div className="relative border-l border-slate-200 pb-5 pl-5 dark:border-slate-800">
                <span className="absolute -left-2 top-1 h-4 w-4 rounded-full bg-brand-600" />
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{event.title}</p>
                  <StatusBadge status={event.type.toLowerCase()} />
                </div>
                <p className="mt-1 text-sm text-slate-500">{event.detail}</p>
                {index === mockTimeline.length - 1 && <p className="mt-3 text-xs text-slate-400">End of current demo timeline</p>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
