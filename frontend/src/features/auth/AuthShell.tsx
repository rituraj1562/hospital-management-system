import { Activity } from 'lucide-react';
import { ReactNode } from 'react';

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="grid min-h-screen bg-slate-50 text-slate-950 lg:grid-cols-[1fr_520px]">
      <section className="hidden bg-[radial-gradient(circle_at_top_left,#e0f2fe,transparent_32%),linear-gradient(135deg,#0f766e,#0f172a)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-md bg-white/15">
            <Activity />
          </div>
          <span className="text-xl font-bold">HMS Console</span>
        </div>
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold leading-tight">Hospital operations, clinical records, and revenue in one secure workspace.</h1>
          <p className="mt-5 text-lg text-cyan-50">Built for admins, doctors, lab teams, pharmacists, receptionists, and patients with role-aware access.</p>
        </div>
      </section>
      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-md bg-brand-600 text-white">
              <Activity />
            </div>
            <p className="text-lg font-bold">HMS Console</p>
          </div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
