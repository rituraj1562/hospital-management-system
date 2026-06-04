import clsx from 'clsx';

const toneByStatus: Record<string, string> = {
  approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  paid: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200',
  issued: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200',
  booked: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-200',
  checked_in: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200',
  in_consultation: 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200',
  processing: 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200',
  rejected: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200',
  cancelled: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200'
};

export function StatusBadge({ status }: { status?: string }) {
  const value = status || 'unknown';
  return (
    <span className={clsx('inline-flex rounded-md px-2 py-1 text-xs font-semibold capitalize', toneByStatus[value] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200')}>
      {value.split('_').join(' ')}
    </span>
  );
}
