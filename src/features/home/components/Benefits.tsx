import { Icon, ClockIcon, MapPinIcon, SearchIcon, ShieldIcon } from '../../../components/icons';
import { useLang } from '../../../i18n';

const icons = [MapPinIcon, ClockIcon, SearchIcon, ShieldIcon];

export function Benefits() {
  const { d } = useLang();
  const benefits = d.benefits.items;
  return (
    <section aria-label={d.benefits.aria} className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit, i) => (
          <li key={benefit.title} className="flex gap-3">
            <Icon icon={icons[i]} size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-action" />
            <div>
              <p className="font-semibold">{benefit.title}</p>
              <p className="mt-1 text-sm text-muted">{benefit.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}