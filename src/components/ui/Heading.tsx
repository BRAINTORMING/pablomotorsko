import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Level = 'h1' | 'h2' | 'h3';

const styles: Record<Level, string> = {
  h1: 'text-2xl font-semibold tracking-tight text-fg',
  h2: 'text-xl font-semibold tracking-tight text-fg',
  h3: 'text-lg font-medium text-fg',
};

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: Level;
}

export function Heading({ as: Tag = 'h2', className, ...props }: HeadingProps) {
  return <Tag className={cn(styles[Tag], className)} {...props} />;
}
