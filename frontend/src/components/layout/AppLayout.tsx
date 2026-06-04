import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Activity, BedDouble, CalendarDays, ClipboardList, ClipboardPlus, FileClock, FlaskConical, LayoutDashboard, LogOut, Menu, Moon, Palette, Pill, ReceiptText, Repeat, ShieldCheck, Stethoscope, Users, X } from 'lucide-react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { toggleTheme } from '../../features/dashboard/uiSlice';
import { ToastHost } from '../ui/ToastHost';
import { ThemePanel } from '../ui/ThemePanel';
import type { Role } from '../../types';

const staffRoles: Role[] = ['super_admin', 'hospital_admin', 'doctor', 'receptionist', 'pharmacist', 'laboratory_technician'];
const adminRoles: Role[] = ['super_admin', 'hospital_admin'];
const clinicalOrPatientRoles: Role[] = [...staffRoles, 'patient'];

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/demo-roles', label: 'Demo Roles', icon: Repeat },
  { to: '/patients', label: 'Patients', icon: Users, roles: clinicalOrPatientRoles },
  { to: '/patient-timeline', label: 'Timeline', icon: ClipboardList, roles: clinicalOrPatientRoles },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope, roles: clinicalOrPatientRoles },
  { to: '/doctor-availability', label: 'Availability', icon: CalendarDays, roles: clinicalOrPatientRoles },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays, roles: clinicalOrPatientRoles },
  { to: '/emr', label: 'EMR', icon: ClipboardPlus, roles: clinicalOrPatientRoles },
  { to: '/laboratory', label: 'Laboratory', icon: FlaskConical, roles: clinicalOrPatientRoles },
  { to: '/lab-builder', label: 'Report Builder', icon: ClipboardPlus, roles: clinicalOrPatientRoles },
  { to: '/pharmacy', label: 'Pharmacy', icon: Pill, roles: clinicalOrPatientRoles },
  { to: '/medicine-alerts', label: 'Stock Alerts', icon: Pill, roles: clinicalOrPatientRoles },
  { to: '/inpatient', label: 'Inpatient', icon: BedDouble, roles: clinicalOrPatientRoles },
  { to: '/billing', label: 'Billing', icon: ReceiptText, roles: clinicalOrPatientRoles },
  { to: '/staff-approvals', label: 'Approvals', icon: ShieldCheck, roles: adminRoles },
  { to: '/audit-logs', label: 'Audit Logs', icon: FileClock, roles: adminRoles }
];

export function AppLayout() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const visibleNavItems = navItems.filter((item) => !item.roles || (user?.role && item.roles.includes(user.role)));

  const sidebar = (
    <>
      <div className="mb-7 flex items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-ring)]">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-lg font-bold">HMS Console</p>
            <p className="text-xs text-slate-500">Clinical operations</p>
          </div>
        </div>
        <button className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 lg:hidden" onClick={() => setMobileOpen(false)} title="Close menu">
          <X size={17} />
        </button>
      </div>
      <nav className="space-y-1.5">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition',
                isActive ? 'bg-[var(--accent-soft)] text-[var(--accent-strong)] ring-1 ring-[var(--accent-ring)] dark:bg-slate-800 dark:text-white' : 'text-slate-600 hover:bg-white/80 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800'
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen text-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-[var(--line)] bg-[var(--surface)] px-4 py-5 shadow-[var(--panel-shadow)] backdrop-blur-xl lg:block">
        {sidebar}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden">
          <aside className="h-full w-80 max-w-[85vw] border-r border-[var(--line)] bg-[var(--surface)] px-4 py-5 backdrop-blur-xl">
            {sidebar}
          </aside>
        </div>
      )}
      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] px-4 shadow-sm backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button title="Open menu" className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--line)] lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu size={18} />
            </button>
            <div>
              <p className="text-sm font-bold">{user?.name || 'Demo User'}</p>
              <p className="text-xs capitalize text-slate-500">{user?.role?.split('_').join(' ') || 'not signed in'} · {user?.approvalStatus || 'approved'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button title="Appearance" className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--line)] bg-white/60 dark:bg-slate-900/60" onClick={() => setThemeOpen(true)}>
              <Palette size={18} />
            </button>
            <button title="Toggle theme" className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--line)] bg-white/60 dark:bg-slate-900/60" onClick={() => dispatch(toggleTheme())}>
              <Moon size={18} />
            </button>
            <button title="Logout" className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--line)] bg-white/60 dark:bg-slate-900/60" onClick={() => dispatch(logout())}>
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
          <Outlet />
        </div>
      </main>
      <ToastHost />
      <ThemePanel open={themeOpen} onClose={() => setThemeOpen(false)} />
    </div>
  );
}
