import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CalendarDays, IndianRupee, Stethoscope, Users } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { api } from '../../services/api';
import { mockDashboard } from '../../services/mockData';

const revenueData = [
  { month: 'Jan', value: 112000 },
  { month: 'Feb', value: 146000 },
  { month: 'Mar', value: 131000 },
  { month: 'Apr', value: 173000 },
  { month: 'May', value: 208000 },
  { month: 'Jun', value: 241000 }
];

export function DashboardPage() {
  const [metrics, setMetrics] = useState({ totalPatients: 0, totalDoctors: 0, dailyAppointments: 0, revenue: 0 });
  const [occupancy, setOccupancy] = useState<{ _id: string; count: number }[]>([]);

  useEffect(() => {
    api.get('/dashboard/admin').then(({ data }) => {
      setMetrics(data.data.metrics);
      setOccupancy(data.data.occupancy);
    }).catch(() => {
      setMetrics(mockDashboard.metrics);
      setOccupancy(mockDashboard.occupancy);
    });
  }, []);

  const cards = [
    { label: 'Total Patients', value: metrics.totalPatients, icon: Users },
    { label: 'Total Doctors', value: metrics.totalDoctors, icon: Stethoscope },
    { label: 'Daily Appointments', value: metrics.dailyAppointments, icon: CalendarDays },
    { label: 'Revenue', value: `Rs. ${metrics.revenue.toLocaleString()}`, icon: IndianRupee }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Operations, revenue, appointments, and occupancy overview.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => (
          <Card key={item.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-bold">{item.value}</p>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950">
                <item.icon size={21} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <h2 className="mb-4 text-base font-semibold">Monthly Revenue</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#0891b2" fill="url(#revenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-base font-semibold">Bed Occupancy</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancy.length ? occupancy : [{ _id: 'available', count: 0 }, { _id: 'occupied', count: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
