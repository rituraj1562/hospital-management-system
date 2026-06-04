import { FileSearch } from 'lucide-react';

export function EmptyState({ title = 'No records found', description = 'Try changing filters or create a new record.' }: { title?: string; description?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900">
      <FileSearch className="mx-auto text-slate-400" />
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
