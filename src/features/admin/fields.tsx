import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

const control =
  'h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-fg placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info disabled:opacity-60';

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, 'h-auto min-h-24 py-2 leading-snug', className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(control, className)} {...props}>
      {children}
    </select>
  );
}

export function Alert({ kind, children }: { kind: 'error' | 'ok'; children: ReactNode }) {
  return (
    <p
      role={kind === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-lg border px-3 py-2 text-sm',
        kind === 'error' ? 'border-danger/40 bg-danger/10 text-danger' : 'border-success/40 bg-success/10 text-success',
      )}
    >
      {children}
    </p>
  );
}

/** Turns a Postgres/PostgREST error into something an admin can act on. */
export function friendlyError(err: { code?: string; message: string }): string {
  if (err.code === '23503') return 'No se puede borrar: hay vehículos o modelos que dependen de este registro. Cámbialos o elimínalos primero.';
  if (err.code === '23505') return 'Ya existe un registro con ese nombre.';
  if (err.code === '42501') return 'Sin permiso: tu usuario no está en la tabla admins.';
  return err.message;
}
