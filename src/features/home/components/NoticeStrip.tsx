import { useLang } from '../../../i18n';

export function NoticeStrip() {
  const { d } = useLang();
  return (
    <div className="border-b border-on-brand/10 bg-brand text-on-brand">
      <p className="mx-auto w-full max-w-7xl px-4 py-3 text-center text-sm sm:px-6 lg:px-8">
        <span className="font-semibold">{d.notice.strong}</span>{' '}
        <span className="text-on-brand/70">{d.notice.soft}</span>
      </p>
    </div>
  );
}