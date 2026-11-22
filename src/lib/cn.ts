export type ClassValue = string | false | null | undefined;

/** Joins class names and skips the empty ones: cn('p-4', isOpen && 'bg-sunken', className). */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
