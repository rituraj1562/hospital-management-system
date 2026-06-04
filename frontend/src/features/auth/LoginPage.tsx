import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login, setTokens, switchDemoRole } from './authSlice';
import { AuthShell } from './AuthShell';
import { Button } from '../../components/ui/Button';
import { firebaseAuth } from '../../services/firebase';
import { api } from '../../services/api';
import { demoUsers } from '../../services/mockData';
import type { User } from '../../types';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('admin@demo-hms.local');
  const [password, setPassword] = useState('Admin@12345');
  const [notice, setNotice] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) navigate('/');
  }

  function continueDemo() {
    dispatch(switchDemoRole(demoUsers[2]));
    navigate('/');
  }

  async function continueWithGoogle() {
    setNotice('');
    if (!firebaseAuth) {
      setNotice('Firebase is not configured.');
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(firebaseAuth, provider);
      const idToken = await credential.user.getIdToken();
      let session: { accessToken: string; refreshToken: string; user: User } = {
        accessToken: idToken,
        refreshToken: '',
        user: {
          id: credential.user.uid,
          name: credential.user.displayName || credential.user.email || 'Google User',
          email: credential.user.email || 'google-user@demo-hms.local',
          role: 'patient',
          approvalStatus: 'approved',
          emailVerified: credential.user.emailVerified
        }
      };

      try {
        const { data } = await api.post('/auth/firebase-session', { idToken, role: 'patient' });
        session = data.data;
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response) throw error;
      }

      dispatch(setTokens(session));
      navigate('/');
    } catch (err) {
      setNotice(err instanceof Error ? err.message.replace('Firebase: ', '') : 'Google sign-in failed.');
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in with your assigned hospital account.">
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-medium">
          Email
          <input className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-brand-600" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-brand-600" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {notice && <p className="rounded-md bg-cyan-50 px-3 py-2 text-sm text-cyan-800">{notice}</p>}
        <Button className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
        <button type="button" className="h-10 w-full rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" onClick={continueWithGoogle}>
          Continue with Google
        </button>
        <button type="button" className="h-10 w-full rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" onClick={continueDemo}>
          Continue in demo mode
        </button>
        <div className="flex justify-between text-sm text-slate-500">
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/register">Create account</Link>
        </div>
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
          <p className="font-semibold">Demo credentials</p>
          <p className="mt-1">For seeded backend demo: admin@demo-hms.local / Admin@12345</p>
          <p className="mt-1">For Firebase demo: register and you will enter the app directly.</p>
        </div>
      </form>
    </AuthShell>
  );
}
