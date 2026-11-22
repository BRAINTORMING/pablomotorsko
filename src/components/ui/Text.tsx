import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/** Secondary paragraph text. */
export function Text({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-muted', className)} {...props} />;
}
