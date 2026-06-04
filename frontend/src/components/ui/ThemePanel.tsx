import { Check, Palette, PanelTop, Rows3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setAccent, setDensity, setSurface } from '../../features/dashboard/uiSlice';
import type { RootState } from '../../app/store';

const accents = [
  { value: 'teal', label: 'Teal', swatch: '#0891b2' },
  { value: 'blue', label: 'Blue', swatch: '#2563eb' },
  { value: 'emerald', label: 'Emerald', swatch: '#059669' },
  { value: 'rose', label: 'Rose', swatch: '#e11d48' },
  { value: 'violet', label: 'Violet', swatch: '#7c3aed' },
  { value: 'amber', label: 'Amber', swatch: '#d97706' },
  { value: 'slate', label: 'Slate', swatch: '#475569' },
  { value: 'indigo', label: 'Indigo', swatch: '#4f46e5' }
] as const;

export function ThemePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const { accent, density, surface } = useAppSelector((state: RootState) => state.ui);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-sm" onClick={onClose}>
      <aside className="absolute right-4 top-20 w-[min(420px,calc(100vw-2rem))] rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--panel-shadow)] backdrop-blur-xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold">Appearance</p>
            <p className="text-sm text-slate-500">Tune the workspace for demos or daily use.</p>
          </div>
          <button className="h-9 rounded-md border border-[var(--line)] px-3 text-sm font-semibold" onClick={onClose}>Done</button>
        </div>

        <section className="mt-6">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Palette size={16} /> Accent</div>
          <div className="grid grid-cols-2 gap-3">
            {accents.map((item) => (
              <button key={item.value} onClick={() => dispatch(setAccent(item.value))} className="flex h-12 items-center justify-between rounded-lg border border-[var(--line)] bg-white/70 px-3 text-sm font-semibold dark:bg-slate-950/60">
                <span className="flex items-center gap-2"><span className="h-5 w-5 rounded-full" style={{ background: item.swatch }} />{item.label}</span>
                {accent === item.value && <Check size={16} />}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Rows3 size={16} /> Density</div>
          <div className="grid grid-cols-2 gap-3">
            {(['comfortable', 'compact'] as const).map((item) => (
              <button key={item} onClick={() => dispatch(setDensity(item))} className="h-11 rounded-lg border border-[var(--line)] bg-white/70 px-3 text-sm font-semibold capitalize dark:bg-slate-950/60">
                {density === item ? '✓ ' : ''}{item}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><PanelTop size={16} /> Surface</div>
          <div className="grid grid-cols-2 gap-3">
            {(['solid', 'glass'] as const).map((item) => (
              <button key={item} onClick={() => dispatch(setSurface(item))} className="h-11 rounded-lg border border-[var(--line)] bg-white/70 px-3 text-sm font-semibold capitalize dark:bg-slate-950/60">
                {surface === item ? '✓ ' : ''}{item}
              </button>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
