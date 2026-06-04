import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAppDispatch } from '../../app/hooks';
import { api } from '../../services/api';
import { firebaseAuth, isFirebaseConfigured } from '../../services/firebase';
import { AuthShell } from './AuthShell';
import { Button } from '../../components/ui/Button';
import { setTokens } from './authSlice';
import type { Role, User } from '../../types';

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');

    try {
      const form = new FormData(event.currentTarget);
      const payload = Object.fromEntries(form) as { name: string; email: string; password: string; role: string };
      const role = payload.role as Role;
      if (isFirebaseConfigured && firebaseAuth) {
        const credential = await createUserWithEmailAndPassword(firebaseAuth, payload.email, payload.password);
        await updateProfile(credential.user, { displayName: payload.name });
        const idToken = await credential.user.getIdToken();
        let session: { accessToken: string; refreshToken: string; user: User } = {
          accessToken: idToken,
          refreshToken: '',
          user: {
            id: credential.user.uid,
            name: payload.name,
            email: payload.email,
            role,
            approvalStatus: role === 'patient' ? 'approved' : 'pending',
            emailVerified: credential.user.emailVerified
          }
        };
        try {
          const { data } = await api.post('/auth/firebase-session', { idToken, role });
          session = data.data;
        } catch {
          // Offline/demo mode signs in immediately using Firebase identity.
        }
        dispatch(setTokens(session));
        if (role !== 'patient') {
          setNotice('Your staff account was created. A hospital admin can approve it later.');
        }
      } else {
        await api.post('/auth/register', payload);
      }
      setDone(true);
      setTimeout(() => navigate(role === 'patient' ? '/' : '/pending-approval'), 500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Account was created in Firebase, but the API server is not reachable on port 5000.');
      } else if (err instanceof Error) {
        const message = err.message.replace('Firebase: ', '');
        if (message.includes('auth/email-already-in-use')) setError('This email is already registered. Go back to login.');
        else if (message.includes('auth/weak-password')) setError('Use a stronger password with at least 6 characters.');
        else if (message.includes('auth/operation-not-allowed')) setError('Enable Email/Password sign-in in Firebase Console.');
        else setError(message);
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Create account" subtitle="Register a patient or request staff onboarding from your hospital admin.">
      {done ? (
        <div className="space-y-3">
          <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Account created. You can now sign in.</p>
          <p className="rounded-md bg-cyan-50 px-4 py-3 text-sm text-cyan-700">Signing you in now...</p>
          {notice && <p className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-700">{notice}</p>}
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <input name="name" required className="h-11 w-full rounded-md border px-3" placeholder="Full name" />
          <input name="email" required type="email" className="h-11 w-full rounded-md border px-3" placeholder="Email" />
          <input name="password" required type="password" minLength={8} className="h-11 w-full rounded-md border px-3" placeholder="Password" />
          <select name="role" className="h-11 w-full rounded-md border px-3" defaultValue="patient">
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
          </select>
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <Button className="w-full" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</Button>
        </form>
      )}
      <Link to="/login" className="mt-5 block text-sm text-brand-700">Back to login</Link>
    </AuthShell>
  );
}
