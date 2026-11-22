import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useLang } from '../i18n';

/** Fila de la tabla `testimonios` tal como está en Supabase. */
export interface TestimonialRow {
  id: number;
  nombre: string;
  titulo: string;
  cita: string;
  titulo_en: string | null;
  cita_en: string | null;
  titulo_pt: string | null;
  cita_pt: string | null;
  foto_url: string | null;
  orden: number;
}

/** Opinión lista para mostrar en la web, ya en el idioma elegido. */
export interface Testimonial {
  id: number | string;
  name: string;
  title: string;
  quote: string;
  fotoUrl: string | null;
}

/** Fotos de las 4 opiniones iniciales (carpeta public/testimonios), en el mismo orden que d.testimonials.samples. */
const SAMPLE_PHOTOS = ['/testimonios/miguel.jpg', '/testimonios/carolina.jpg', '/testimonios/patricia.jpg', '/testimonios/andrea.jpg'];

// Una sola petición compartida por la web pública. El admin la reinicia cada vez que guarda algo.
let shared: Promise<TestimonialRow[] | null> | null = null;

const load = () =>
  (shared ??= (async () => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('testimonios').select('*').order('orden').order('id');
    if (error) {
      shared = null;
      return null; // tabla aún no creada o sin conexión: se usan los textos de ejemplo
    }
    return (data as TestimonialRow[]) ?? [];
  })());

export const resetTestimonials = () => {
  shared = null;
};

/**
 * Opiniones de clientes. Mientras Supabase no responda (o la tabla no exista) se muestran las de ejemplo.
 * Si la tabla existe y está vacía, la sección se oculta.
 */
export function useTestimonials(): Testimonial[] {
  const { lang, d } = useLang();
  const [rows, setRows] = useState<TestimonialRow[] | null>(null);

  useEffect(() => {
    let alive = true;
    load().then((r) => alive && setRows(r));
    return () => {
      alive = false;
    };
  }, []);

  if (rows === null)
    return d.testimonials.samples.map((s, i) => ({ id: `sample-${i}`, name: s.name, title: s.title, quote: s.quote, fotoUrl: SAMPLE_PHOTOS[i] ?? null }));

  return rows.map((r) => ({
    id: r.id,
    name: r.nombre,
    // Si falta la traducción se usa el texto en español.
    title: (lang === 'en' ? r.titulo_en : lang === 'pt' ? r.titulo_pt : null) || r.titulo,
    quote: (lang === 'en' ? r.cita_en : lang === 'pt' ? r.cita_pt : null) || r.cita,
    fotoUrl: r.foto_url,
  }));
}
