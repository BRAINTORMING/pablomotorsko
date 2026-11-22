import { useLang } from '../../../i18n';

export function StatsBar() {
  const { d } = useLang();
  const stats = d.stats.items;
  return (
    <section aria-label={d.stats.aria} className="bg-action text-on-action">
      <ul className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-6 gap-y-4 px-4 py-5 sm:px-6 md:grid-cols-5 lg:px-8">
        {stats.map((stat) => (
          <li key={stat.value} className="flex flex-col">
            <span className="text-lg font-semibold tabular-nums">{stat.value}</span>
            <span className="text-sm text-on-action/70">{stat.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}