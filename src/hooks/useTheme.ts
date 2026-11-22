import { useContext } from 'react';
import { ThemeContext, type ThemeContextValue } from '../providers/ThemeProvider';

/** Current theme and the functions to change it: const { theme, toggleTheme } = useTheme(). */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>');
  return context;
}
