import { useMemo, useState } from 'react';
import { useInventory } from '../../../lib/inventory';
import { cn } from '../../../lib/cn';
import { useLang } from '../../../i18n';
import { Pagination } from './Pagination';
import { VehicleCard } from './VehicleCard';

const PAGE_SIZE = 12;

export function Catalog() {
  const { d, tr } = useLang();
  const { vehicles, loading } = useInventory();
  // Valor interno estable (no cambia con el idioma); lo que se ve es d.catalog.all.
  const ALL = '__all__';
  const [body, setBody] = useState(ALL);
  const [page, setPage] = useState(1);

  const vehicleBodies = useMemo(() => [ALL, ...Array.from(new Set(vehicles.map((v) => v.tipo).filter(Boolean)))], [vehicles]);
  const list = useMemo(() => (body === ALL ? vehicles : vehicles.filter((v) => v.tipo === body)), [body, vehicles]);
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const shown = list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const chooseBody = (next: string) => {
    setBody(next);
    setPage(1);
  };

  return (
    <section id="catalogo" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{d.catalog.title}</h2>
      <p className="mt-1 text-sm text-muted">{d.catalog.subtitle}</p>

      <ul aria-label={d.catalog.perksAria} className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
        {d.catalog.perks.map((perk) => (
          <li key={perk} className="rounded-lg border border-line bg-surface px-3 py-3 text-center text-sm font-medium">
            {perk}
          </li>
        ))}
      </ul>

      <div role="group" aria-label={d.catalog.filterAria} className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {vehicleBodies.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={name === body}
            onClick={() => chooseBody(name)}
            className={cn(
              'h-9 shrink-0 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info',
              name === body ? 'border-action bg-action text-on-action' : 'border-line bg-surface text-fg hover:bg-sunken',
            )}
          >
            {name === ALL ? d.catalog.all : tr('tipos', name)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-6 rounded-2xl border border-line bg-surface p-8 text-center text-sm text-muted">{d.catalog.loading}</p>
      ) : shown.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-2xl border border-line bg-surface p-8 text-center text-sm text-muted">
          {d.catalog.empty}
        </p>
      )}

      {totalPages > 1 && <Pagination page={current} totalPages={totalPages} onPageChange={setPage} />}
    </section>
  );
}