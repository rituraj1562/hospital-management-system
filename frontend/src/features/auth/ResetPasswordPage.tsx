import { FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { AuthShell } from './AuthShell';
import { Button } from '../../components/ui/Button';

export function ResetPasswordPage() {
  const { token } = useParams();
  const [done, setDone] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get('password');
    await api.post(`/auth/reset-password/${token}`, { password });
    setDone(true);
  }
  return (
    <AuthShell title="Choose a new password" subtitle="Use at least eight characters.">
      {done ? <p className="text-sm text-emerald-700">Password changed.</p> : (
        <form onSubmit={submit} className="space-y-4">
          <input name="password" required type="password" minLength={8} className="h-11 w-full rounded-md border px-3" placeholder="New password" />
          <Button className="w-full">Update password</Button>
        </form>
      )}
      <Link to="/login" className="mt-5 block text-sm text-brand-700">Back to login</Link>
    </AuthShell>
  );
}
