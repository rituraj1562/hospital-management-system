import { ReactNode } from 'react';
import { EmptyState } from './EmptyState';

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

export function DataTable<T>({ rows, columns }: { rows: T[]; columns: Column<T>[] }) {
  if (!rows.length) return <EmptyState />;

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] shadow-[var(--panel-shadow)] backdrop-blur">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--line)] text-sm">
          <thead className="bg-slate-50/80 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/70">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-semibold">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {rows.map((row, index) => (
              <tr key={index} className="text-slate-700 transition hover:bg-[var(--accent-soft)]/60 dark:text-slate-200 dark:hover:bg-slate-800/60">
                {columns.map((column) => (
                  <td key={column.key} className="whitespace-nowrap px-4 py-3">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
