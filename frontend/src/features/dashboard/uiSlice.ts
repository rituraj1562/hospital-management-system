import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  darkMode: boolean;
  accent: 'teal' | 'blue' | 'emerald' | 'rose' | 'violet' | 'amber' | 'slate' | 'indigo';
  density: 'comfortable' | 'compact';
  surface: 'solid' | 'glass';
  toasts: Array<{ id: string; type: 'success' | 'error' | 'info'; message: string }>;
}

const initialState: UiState = {
  darkMode: typeof localStorage !== 'undefined' && localStorage.getItem('hms-theme') === 'dark',
  accent: (typeof localStorage !== 'undefined' ? localStorage.getItem('hms-accent') : 'teal') as UiState['accent'] || 'teal',
  density: (typeof localStorage !== 'undefined' ? localStorage.getItem('hms-density') : 'comfortable') as UiState['density'] || 'comfortable',
  surface: (typeof localStorage !== 'undefined' ? localStorage.getItem('hms-surface') : 'solid') as UiState['surface'] || 'solid',
  toasts: []
};

function applyThemeState(state: Pick<UiState, 'darkMode' | 'accent' | 'density' | 'surface'>) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', state.darkMode);
  document.documentElement.dataset.accent = state.accent;
  document.documentElement.dataset.density = state.density;
  document.documentElement.dataset.surface = state.surface;
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.darkMode = !state.darkMode;
      if (typeof localStorage !== 'undefined') localStorage.setItem('hms-theme', state.darkMode ? 'dark' : 'light');
      applyThemeState(state);
    },
    setAccent(state, action: { payload: UiState['accent'] }) {
      state.accent = action.payload;
      if (typeof localStorage !== 'undefined') localStorage.setItem('hms-accent', state.accent);
      applyThemeState(state);
    },
    setDensity(state, action: { payload: UiState['density'] }) {
      state.density = action.payload;
      if (typeof localStorage !== 'undefined') localStorage.setItem('hms-density', state.density);
      applyThemeState(state);
    },
    setSurface(state, action: { payload: UiState['surface'] }) {
      state.surface = action.payload;
      if (typeof localStorage !== 'undefined') localStorage.setItem('hms-surface', state.surface);
      applyThemeState(state);
    },
    pushToast(state, action: { payload: { type: 'success' | 'error' | 'info'; message: string } }) {
      state.toasts.push({ id: crypto.randomUUID(), ...action.payload });
    },
    dismissToast(state, action: { payload: string }) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    }
  }
});

applyThemeState(initialState);

export const { dismissToast, pushToast, setAccent, setDensity, setSurface, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
