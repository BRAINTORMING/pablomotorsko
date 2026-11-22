import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { useInView } from '../hooks/useInView';

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  /** Delay in milliseconds before the entrance starts. */
  delay?: number;
}

/** Fades and rises its content the first time it scrolls into view. Respects reduced motion. */
export function Reveal({ delay = 0, className, style, ...props }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ ...style, transitionDelay: delay + 'ms' }}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-out',
        'motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0',
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
      {...props}
    />
  );
}