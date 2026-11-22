import type { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { LangProvider } from '../i18n';

/** Every provider of the app in one place, so main.tsx stays short. Add new providers here. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LangProvider>{children}</LangProvider>
    </ThemeProvider>
  );
}
