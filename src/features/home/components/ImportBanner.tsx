import { Button } from '../../../components/ui';
import { useLang } from '../../../i18n';

export function ImportBanner() {
  const { d } = useLang();
  return (
    <section id="servicios" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-brand p-6 text-on-brand sm:p-8 lg:p-12">
        <p className="text-sm text-on-brand/70">{d.importBanner.eyebrow}</p>
        <h2 className="mt-2 max-w-xl text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          {d.importBanner.title}
        </h2>
        <p className="mt-3 max-w-xl text-pretty text-base text-on-brand/80">
          {d.importBanner.text}
        </p>
        <Button variant="secondary" className="mt-6">
          {d.importBanner.button}
        </Button>
      </div>
    </section>
  );
}