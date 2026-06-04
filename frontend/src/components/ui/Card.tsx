import { HTMLAttributes } from 'react';
import clsx from 'clsx';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-[var(--line)] bg-[var(--surface)] p-[var(--card-pad)] shadow-[var(--panel-shadow)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl',
        className
      )}
      {...props}
    />
  );
}
