import { Icon, HeartIcon, ShareIcon } from '../../../components/icons';
import { formatCLP, type InventoryVehicle, type TagColor } from '../../../lib/inventory';
import { SmartImage } from '../../../components/SmartImage';
import { Button } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { useLang } from '../../../i18n';

const tagStyle: Record<TagColor, string> = {
  success: 'bg-success text-canvas',
  info: 'bg-info text-canvas',
  warning: 'bg-warning text-canvas',
  danger: 'bg-danger text-canvas',
  neutral: 'bg-fg text-canvas',
};

export function VehicleCard({ vehicle: v }: { vehicle: InventoryVehicle }) {
  const { d, tr } = useLang();
  const title = `${v.marca} ${v.modelo}`;
  const specs = [String(v.anio), tr('tipos', v.tipo), tr('combustibles', v.combustible), tr('transmisiones', v.transmision)].filter(Boolean);

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border bg-surface shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none',
        v.ofertaEspecial ? 'border-danger' : 'border-line',
      )}
    >
      {v.ofertaEspecial && (
        <p className="bg-danger px-3 py-1 text-center text-xs font-semibold text-canvas">{d.card.special}</p>
      )}
      <div className="relative">
        {v.fotoUrl ? (
          <img src={v.fotoUrl} alt={title} width={480} height={320} loading="lazy" className="block aspect-[3/2] w-full object-cover" />
        ) : (
          <SmartImage query={`${title} ${v.anio}`} seed={v.id} w={480} h={320} alt={title} className="aspect-[3/2]" />
        )}
        {v.etiqueta && (
          <span className={cn('absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-semibold', tagStyle[v.etiquetaColor])}>
            {tr('etiquetas', v.etiqueta)}
          </span>
        )}
        <button
          type="button"
          aria-label={d.card.fav}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface text-fg transition-colors hover:bg-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"
        >
          <Icon icon={HeartIcon} size={16} strokeWidth={1.5} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold uppercase tracking-tight">{title}</h3>
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
          {specs.map((spec) => (
            <li key={spec} className="truncate after:ml-3 after:text-line after:content-['·'] last:after:content-none">
              {spec}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xl font-semibold tabular-nums">{formatCLP(v.precio)}</p>
        <div className="mt-4 flex items-center gap-2">
          <Button variant="secondary" size="sm" className="flex-1">
            {d.card.compare}
          </Button>
          <Button size="sm" className="flex-1">
            {d.card.more}
          </Button>
          <Button variant="ghost" size="sm" aria-label={d.card.share}>
            <Icon icon={ShareIcon} size={16} strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </article>
  );
}