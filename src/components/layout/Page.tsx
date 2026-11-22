import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/** Full-height page with the canvas background. Centers its content; pass className to change that. */
export function Page({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <main className={cn('flex min-h-screen items-center justify-center bg-canvas p-6', className)} {...props} />;
}
