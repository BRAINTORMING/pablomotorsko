import { useLang } from '../../../i18n';

export function Footer() {
  const { d } = useLang();
  const footer = d.footer;
  return (
    <footer className="bg-brand text-on-brand">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="text-lg font-semibold tracking-tight">G9 AUTO TRADERS</p>
          <p className="mt-3 max-w-xs text-sm text-on-brand/70">{footer.about}</p>
        </div>
        {footer.columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="text-sm font-semibold">{column.title}</p>
            <ul className="mt-3 space-y-2 text-sm text-on-brand/70">
              {column.links.map((link) => (
                <li key={link}>
                  <a href="#" className="rounded-sm transition-colors hover:text-on-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-on-brand/10">
        <p className="mx-auto w-full max-w-7xl px-4 py-6 text-xs text-on-brand/60 sm:px-6 lg:px-8">
          {footer.rights}{' '}
          <a href="#/admin" className="ml-2 underline-offset-2 hover:text-on-brand hover:underline">
            {footer.admin}
          </a>
        </p>
      </div>
    </footer>
  );
}