import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { mockDoctorAvailability } from '../../services/mockData';

export function DoctorAvailabilityPage() {
  const [blocked, setBlocked] = useState<Record<string, string[]>>(
    Object.fromEntries(mockDoctorAvailability.map((day) => [day.day, day.blocked]))
  );

  function toggle(day: string, slot: string) {
    setBlocked((current) => {
      const values = current[day] || [];
      return { ...current, [day]: values.includes(slot) ? values.filter((item) => item !== slot) : [...values, slot] };
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Doctor Availability Calendar</h1>
        <p className="text-sm text-slate-500">Build weekly schedules, block slots, and preview appointment availability.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-5">
        {mockDoctorAvailability.map((day) => (
          <Card key={day.day}>
            <h2 className="font-semibold">{day.day}</h2>
            <div className="mt-4 space-y-2">
              {day.slots.map((slot) => {
                const isBlocked = blocked[day.day]?.includes(slot);
                return (
                  <button key={slot} onClick={() => toggle(day.day, slot)} className={`h-10 w-full rounded-md border text-sm font-semibold ${isBlocked ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                    {slot} · {isBlocked ? 'Blocked' : 'Open'}
                  </button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
      <Button>Save Availability</Button>
    </div>
  );
}
