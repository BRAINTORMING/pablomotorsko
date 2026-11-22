import { contact } from '../../../data/dealership';
import { useLang } from '../../../i18n';

/** Botón flotante de WhatsApp. Abre un chat con el número de `contact.whatsapp` y un mensaje inicial en el idioma elegido. */
export function WhatsappButton() {
  const { d } = useLang();
  const href = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(d.whatsapp.message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2">
      <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-white text-brand text-xs font-semibold shadow-lg whitespace-nowrap">
        {d.whatsapp.help}
      </span>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={d.whatsapp.aria}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-success text-white shadow-lg hover:bg-success/90 transition-all active:scale-95"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>
    </div>
  );
}
