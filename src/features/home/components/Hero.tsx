import { Button } from '../../../components/ui';
import { useLang } from '../../../i18n';
import { HeroBackground } from './HeroBackground';
import logo from '@/assets/g9-auto-traders.jpg';

export function Hero() {
  const { d } = useLang();
  const goToCatalog = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-brand text-on-brand">
      {/* Fotos de fondo que rotan solas, con bordes difuminados que se funden con el hero. */}
      <HeroBackground />

      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 pt-10 pb-14 sm:px-6 lg:px-8 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="max-w-xl">
            {/* Logo grande sobre un panel blanco: el logo es oscuro y necesita fondo claro para verse sobre el hero. */}
            <div className="mb-8 inline-block rounded-3xl bg-white p-3 shadow-2xl shadow-black/40 ring-1 ring-white/20 sm:p-4">
              <img
                src={logo}
                alt="G9 Auto Traders · Chile | Korea"
                className="block h-32 w-auto sm:h-40 lg:h-48"
                fetchPriority="high"
              />
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl mb-4 leading-[1.05] text-balance">
              {d.hero.title1}<br />{d.hero.title2} <span className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">{d.hero.title3}</span>
            </h1>
            <p className="text-lg font-medium text-on-brand/85 leading-snug sm:text-xl">
              {d.hero.subtitle1}<br />{d.hero.subtitle2}
            </p>
          </div>

          <div className="hidden lg:block" />
        </div>

        <form role="search" onSubmit={goToCatalog} className="mt-10 relative z-20 mx-auto max-w-3xl lg:mt-14">
          <label className="relative block">
            <span className="sr-only">{d.hero.searchLabel}</span>
            <svg
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder={d.hero.searchPlaceholder}
              className="h-12 w-full rounded-xl border border-line bg-surface pl-11 pr-4 text-sm text-fg shadow-lg shadow-black/20 placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"
            />
          </label>
          <div className="mt-3 rounded-2xl border border-on-brand/15 bg-on-brand/10 p-2 shadow-lg shadow-black/20 backdrop-blur-md">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-[repeat(4,minmax(0,1fr))_auto] items-center">
              {d.hero.filters.map((filter) => (
                <select
                  key={filter.label}
                  aria-label={filter.label}
                  defaultValue={filter.options[0]}
                  className="h-10 w-full min-w-0 rounded-lg border border-line bg-surface px-3 text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"
                >
                  {filter.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ))}
              <Button type="submit" size="sm" aria-label={d.hero.searchButton} className="col-span-2 h-10 w-full md:col-span-1 md:w-10 p-0 shrink-0">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </Button>
            </div>
          </div>
        </form>

      </div>
    </section>
  );
}
