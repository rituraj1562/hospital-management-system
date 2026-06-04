import { FormEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Card } from './Card';
import { api } from '../../services/api';

export function ModuleForm({ title, subtitle, endpoint, children }: { title: string; subtitle: string; endpoint: string; children: ReactNode }) {
  const navigate = useNavigate();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await api.post(endpoint, payload);
    } catch {
      // Offline demo mode: keep the flow smooth.
    }
    navigate(-1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <Card>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          {children}
          <div className="md:col-span-2">
            <Button>Save</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
