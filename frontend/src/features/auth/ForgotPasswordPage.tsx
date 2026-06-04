import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { api } from '../../services/api';
import { firebaseAuth, isFirebaseConfigured } from '../../services/firebase';
import { AuthShell } from './AuthShell';
import { Button } from '../../components/ui/Button';

export function ForgotPasswordPage() {
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get('email');
    if (isFirebaseConfigured && firebaseAuth && typeof email === 'string') {
      await sendPasswordResetEmail(firebaseAuth, email);
      setMessage('If the email exists, Firebase has sent a reset link.');
    } else {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message);
    }
  }
  return (
    <AuthShell title="Reset password" subtitle="We will email a secure reset link if the account exists.">
      <form onSubmit={submit} className="space-y-4">
        <input name="email" required type="email" className="h-11 w-full rounded-md border px-3" placeholder="Email" />
        <Button className="w-full">Send reset link</Button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </form>
      <Link to="/login" className="mt-5 block text-sm text-brand-700">Back to login</Link>
    </AuthShell>
  );
}
