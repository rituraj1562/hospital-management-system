import { Button } from './Button';

export function ConfirmDialog({ open, title, body, onCancel, onConfirm }: { open: boolean; title: string; body: string; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-soft dark:bg-slate-900">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{body}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="h-10 rounded-md border border-slate-300 px-4 text-sm font-semibold dark:border-slate-700" onClick={onCancel}>Cancel</button>
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}
