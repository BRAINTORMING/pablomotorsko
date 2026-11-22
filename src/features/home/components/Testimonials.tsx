import { useTestimonials } from '../../../lib/testimonials';
import { useLang } from '../../../i18n';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

export function Testimonials() {
  const { d } = useLang();
  const testimonials = useTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonios" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{d.testimonials.title}</h2>
      <p className="mt-2 max-w-2xl text-pretty text-muted">{d.testimonials.subtitle}</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t) => (
          <li key={t.id} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="flex aspect-[4/3] items-center justify-center bg-sunken">
              {t.fotoUrl ? (
                <img
                  src={t.fotoUrl}
                  alt={`${d.testimonials.photoOf} ${t.name}`}
                  width={480}
                  height={360}
                  loading="lazy"
                  className="h-full w-full object-cover object-[50%_20%]"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-action text-xl font-semibold text-on-action"
                >
                  {initials(t.name)}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-semibold">{t.title}</h3>
              <div className="mt-1 flex items-center gap-1 text-amber-intense" role="img" aria-label={d.testimonials.rating}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <svg key={n} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="mt-2 line-clamp-4 text-sm text-muted">{t.quote}</p>
              <p className="mt-auto pt-4 text-sm font-medium">{t.name}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
