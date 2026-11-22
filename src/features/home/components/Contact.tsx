import { Icon, PhoneIcon, MapPinIcon, MailIcon, ClockIcon } from '../../../components/icons';
import { contact } from '../../../data/dealership';
import { useLang } from '../../../i18n';

const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(contact.address + ', Chile');

const linkClass =
  'flex h-12 items-center gap-2 rounded-xl border border-on-brand/15 bg-on-brand/5 px-4 text-sm font-medium transition-colors hover:bg-on-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info';

export function Contact() {
  const { d } = useLang();
  return (
    <section id="contacto" className="bg-brand text-on-brand">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-16">
        <div>
          <h2 className="text-balance text-2xl font-black uppercase tracking-tight sm:text-3xl">
            {d.contact.title1}{' '}
            <span className="text-amber-intense">{d.contact.title2}</span>
          </h2>
          <p className="mt-3 max-w-md text-pretty text-on-brand/70">
            {d.contact.text}
          </p>
          <p className="mt-6 flex items-center gap-2 text-sm text-on-brand/70">
            <Icon icon={ClockIcon} size={16} strokeWidth={1.5} className="shrink-0" />
            {d.contact.hours}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {contact.phones.map((phone) => (
              <li key={phone}>
                <a href={'tel:' + phone.replace(/\s/g, '')} className={linkClass}>
                  <Icon icon={PhoneIcon} size={16} strokeWidth={1.5} className="shrink-0" />
                  {phone}
                </a>
              </li>
            ))}
            <li className="sm:col-span-2">
              <a href={'mailto:' + contact.email} className={linkClass}>
                <Icon icon={MailIcon} size={16} strokeWidth={1.5} className="shrink-0" />
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col overflow-hidden rounded-2xl border border-on-brand/15 bg-surface text-fg">
          <div className="overflow-hidden rounded-2xl border border-line bg-sunken">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.8495282054305!2d-70.125314325616!3d-20.265074348828236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9152148cc682a805%3A0x9dc9b935ae9425e2!2sLos%20Algarrobos%203952%2C%201111811%20Iquique%2C%20Tarapac%C3%A1!5e0!3m2!1ses-419!2scl!4v1794191077638!5m2!1ses-419!2scl"
              title={d.contact.mapTitle}
              className="w-full h-[300px] md:h-[450px]"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{ border: 0 }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="text-sm text-muted">{d.contact.visit}</p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center rounded-xl bg-action px-4 text-sm font-medium text-on-action transition-colors hover:bg-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"
            >
              {d.contact.openMaps}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}