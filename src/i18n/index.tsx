import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { es, type Dict } from './es';
import { en } from './en';
import { pt } from './pt';

export type Lang = 'es' | 'en' | 'pt';

export const LANGS: { code: Lang; flag: string; name: string }[] = [
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'pt', flag: '🇵🇹', name: 'Português' },
];

const dicts: Record<Lang, Dict> = { es, en, pt };
const STORAGE_KEY = 'g9-lang';

const isLang = (v: unknown): v is Lang => v === 'es' || v === 'en' || v === 'pt';

function initialLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* storage not available: use the default */
  }
  return 'es';
}

type ValueGroup = keyof Dict['values'];

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Whole dictionary of the current language: d.hero.title1, d.catalog.perks... */
  d: Dict;
  /** Translates a value that comes from the database (tag, body type, fuel, transmission). Unknown values are returned as they are. */
  tr: (group: ValueGroup, value: string | null | undefined) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

/** Replaces {name} placeholders: fmt('Hello {x}', { x: 'KIA' }) */
export const fmt = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''));

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const value = useMemo<LangContextValue>(() => {
    const d = dicts[lang];
    return {
      lang,
      d,
      setLang: (next) => {
        setLangState(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          /* ignore */
        }
      },
      tr: (group, v) => (v ? d.values[group][v] ?? v : ''),
    };
  }, [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.querySelector('meta[name="description"]')?.setAttribute('content', dicts[lang].meta.description);
  }, [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
