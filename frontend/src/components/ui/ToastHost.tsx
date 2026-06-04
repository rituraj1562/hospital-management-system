import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { dismissToast } from '../../features/dashboard/uiSlice';

export function ToastHost() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.ui.toasts);

  return (
    <div className="fixed right-4 top-20 z-50 space-y-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="flex min-w-72 items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="font-semibold capitalize">{toast.type}</p>
            <p className="text-slate-500">{toast.message}</p>
          </div>
          <button title="Dismiss" onClick={() => dispatch(dismissToast(toast.id))}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
