import { useState } from 'react';
import { formatCLP, useInventory } from '../../../lib/inventory';
import { SmartImage } from '../../../components/SmartImage';
import { cn } from '../../../lib/cn';
import { fmt, useLang } from '../../../i18n';

export function Brands() {
  const { d } = useLang();
  const { brands, vehicles } = useInventory();
  const [selected, setSelected] = useState('KIA');
  const brand = brands.includes(selected) ? selected : brands[0] ?? '';
  const models = vehicles.filter((v) => v.marca === brand && v.etiqueta !== 'Vendido').slice(0, 6);

  return (
    <section aria-labelledby="marcas-titulo" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h2 id="marcas-titulo" className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {d.brands.title}
      </h2>
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="text-sm text-muted">{d.brands.select}</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {brands.map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={name === brand}
                onClick={() => setSelected(name)}
                className={cn(
                  'h-14 truncate rounded-xl border px-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info',
                  name === brand ? 'border-action bg-action text-on-action' : 'border-line bg-surface text-fg hover:bg-sunken',
                )}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0 lg:col-span-8">
          <p className="text-sm text-muted">{fmt(d.brands.available, { brand })}</p>
          {models.length > 0 ? (
            <ul className="mt-4 flex snap-x gap-4 overflow-x-auto pb-2">
              {models.map((v) => (
                <li key={v.id} className="w-56 shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-surface">
                  {v.fotoUrl ? (
                    <img src={v.fotoUrl} alt={`${v.marca} ${v.modelo}`} width={400} height={260} loading="lazy" className="aspect-[3/2] w-full object-cover" />
                  ) : (
                    <SmartImage query={`${v.marca} ${v.modelo} ${v.anio}`} seed={v.id} w={400} h={260} alt={`${v.marca} ${v.modelo}`} className="aspect-[3/2]" />
                  )}
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold uppercase">
                      {v.marca} {v.modelo}
                    </p>
                    <p className="mt-1 text-sm font-semibold tabular-nums">{formatCLP(v.precio)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
              {fmt(d.brands.soon, { brand })}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}