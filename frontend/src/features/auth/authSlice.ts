import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { api } from '../../services/api';
import { firebaseAuth, isFirebaseConfigured } from '../../services/firebase';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('hms-auth') : null;
const initialState: AuthState = stored
  ? JSON.parse(stored)
  : { user: null, accessToken: null, refreshToken: null, loading: false, error: null };

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      if (isFirebaseConfigured && firebaseAuth) {
        const credential = await signInWithEmailAndPassword(firebaseAuth, payload.email, payload.password);
        const idToken = await credential.user.getIdToken();
        try {
          const { data } = await api.post('/auth/firebase-session', { idToken });
          return data.data as { user: User; accessToken: string; refreshToken: string };
        } catch (error) {
          if (axios.isAxiosError(error) && !error.response) {
            return {
              accessToken: idToken,
              refreshToken: '',
              user: {
                id: credential.user.uid,
                name: credential.user.displayName || credential.user.email || 'Firebase User',
                email: credential.user.email || payload.email,
                role: 'patient',
                approvalStatus: 'approved',
                emailVerified: credential.user.emailVerified
              }
            } as { user: User; accessToken: string; refreshToken: string };
          }
          throw error;
        }
      }
      const { data } = await api.post('/auth/login', payload);
      return data.data as { user: User; accessToken: string; refreshToken: string };
    } catch (error) {
      return rejectWithValue(authErrorMessage(error));
    }
  }
);

function authErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'API server is not reachable. Start the backend on port 5000.';
  }
  if (error instanceof Error) {
    const message = error.message.replace('Firebase: ', '');
    if (message.includes('auth/email-already-in-use')) return 'This email is already registered.';
    if (message.includes('auth/weak-password')) return 'Use a stronger password with at least 6 characters.';
    if (message.includes('auth/invalid-credential')) return 'Invalid email or password.';
    if (message.includes('auth/operation-not-allowed')) return 'Enable Email/Password sign-in in Firebase Console.';
    if (message.includes('auth/too-many-requests')) return 'Too many attempts. Please try again later.';
    return message;
  }
  return 'Authentication failed';
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      if (typeof localStorage !== 'undefined') localStorage.setItem('hms-auth', JSON.stringify(state));
    },
    logout(state) {
      if (firebaseAuth) signOut(firebaseAuth).catch(() => undefined);
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      if (typeof localStorage !== 'undefined') localStorage.removeItem('hms-auth');
    },
    switchDemoRole(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.accessToken = state.accessToken || 'demo-token';
      state.refreshToken = state.refreshToken || 'demo-refresh';
      state.error = null;
      if (typeof localStorage !== 'undefined') localStorage.setItem('hms-auth', JSON.stringify(state));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        if (typeof localStorage !== 'undefined') localStorage.setItem('hms-auth', JSON.stringify(state));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Authentication failed';
      });
  }
});

export const { logout, setTokens, switchDemoRole } = authSlice.actions;
export default authSlice.reducer;
