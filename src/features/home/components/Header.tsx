import g9Logo from '@/assets/g9-auto-traders.png';
import { LANGS, useLang } from '../../../i18n';
import { cn } from '../../../lib/cn';

export function Header() {
  const { lang, setLang, d } = useLang();
  const navLinks = [
    { label: d.nav.home, href: '#inicio' },
    { label: d.nav.vehicles, href: '#catalogo' },
    { label: d.nav.accessories, href: '#catalogo' },
    { label: d.nav.services, href: '#servicios' },
    { label: d.nav.info, href: '#testimonios' },
    { label: d.nav.contact, href: '#contacto' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-on-brand/10 bg-brand/90 text-on-brand backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-1 shrink-0">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                lang={l.code}
                title={l.name}
                aria-label={`${d.header.changeLang} ${l.name}`}
                aria-pressed={l.code === lang}
                onClick={() => setLang(l.code)}
                className={cn(
                  'flex items-center justify-center h-9 w-9 rounded-md text-lg leading-none transition hover:bg-on-brand/10 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info',
                  l.code === lang ? 'bg-on-brand/15 opacity-100 ring-1 ring-on-brand/30' : 'opacity-60',
                )}
              >
                {l.flag}
              </button>
            ))}
          </div>
          <nav aria-label={d.nav.main} className="flex min-w-0 items-center gap-6 overflow-x-auto whitespace-nowrap text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-md px-1 py-1 text-on-brand/75 transition-colors hover:text-on-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <a href="#inicio" className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info">
          <img src={g9Logo} alt="G9 Auto Traders" className="block h-11 w-auto" />
        </a>
      </div>
    </header>
  );
}
