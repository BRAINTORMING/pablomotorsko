import { useCallback, useEffect, useState } from 'react';
import { PHOTO_BUCKET, supabase } from '../../lib/supabase';
import { resetTestimonials, type TestimonialRow } from '../../lib/testimonials';
import { Button } from '../../components/ui';
import { cn } from '../../lib/cn';
import { Alert, Field, Input, Textarea, friendlyError } from './fields';

interface Form {
  id: number | null;
  foto_url: string | null;
  nombre: string;
  titulo: string;
  cita: string;
  titulo_en: string;
  cita_en: string;
  titulo_pt: string;
  cita_pt: string;
  orden: string;
}

const emptyForm = (orden: number): Form => ({
  id: null,
  foto_url: null,
  nombre: '',
  titulo: '',
  cita: '',
  titulo_en: '',
  cita_en: '',
  titulo_pt: '',
  cita_pt: '',
  orden: String(orden),
});

const MAX_PHOTO = 5 * 1024 * 1024;

/** Sube una foto al bucket público y devuelve su URL (o un mensaje de error). */
async function uploadPhoto(file: File): Promise<{ url: string } | { error: string }> {
  if (!supabase) return { error: 'Supabase no está configurado.' };
  if (!file.type.startsWith('image/')) return { error: 'El archivo debe ser una imagen.' };
  if (file.size > MAX_PHOTO) return { error: 'La foto pesa más de 5 MB.' };
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `testimonios/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file, { cacheControl: '31536000' });
  if (error) return { error: friendlyError(error) };
  return { url: supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl };
}

export function TestimoniosPanel() {
  const [rows, setRows] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form | null>(null);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('testimonios').select('*').order('orden').order('id');
    if (error) {
      setMsg({
        kind: 'error',
        text:
          error.code === '42P01' || error.code === 'PGRST205'
            ? 'Falta crear la tabla "testimonios". Ejecuta supabase/migracion_testimonios.sql en el SQL Editor de Supabase.'
            : friendlyError(error),
      });
    }
    setRows((data as TestimonialRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => (f ? { ...f, [key]: value } : f));

  const edit = (r: TestimonialRow) => {
    setMsg(null);
    setForm({
      id: r.id,
      foto_url: r.foto_url,
      nombre: r.nombre,
      titulo: r.titulo,
      cita: r.cita,
      titulo_en: r.titulo_en ?? '',
      cita_en: r.cita_en ?? '',
      titulo_pt: r.titulo_pt ?? '',
      cita_pt: r.cita_pt ?? '',
      orden: String(r.orden),
    });
  };

  /** Foto dentro del formulario: solo se guarda en la base al pulsar "Guardar". */
  const uploadInForm = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setMsg(null);
    const res = await uploadPhoto(file);
    setBusy(false);
    if ('error' in res) return setMsg({ kind: 'error', text: res.error });
    set('foto_url', res.url);
  };

  /** Cambio rápido desde la lista: sube la foto y la guarda de inmediato. */
  const quickChange = async (r: TestimonialRow, file: File | undefined) => {
    if (!file || !supabase) return;
    setBusyId(r.id);
    setMsg(null);
    const res = await uploadPhoto(file);
    if ('error' in res) {
      setBusyId(null);
      return setMsg({ kind: 'error', text: res.error });
    }
    const { error } = await supabase.from('testimonios').update({ foto_url: res.url }).eq('id', r.id);
    setBusyId(null);
    if (error) return setMsg({ kind: 'error', text: friendlyError(error) });
    resetTestimonials();
    setMsg({ kind: 'ok', text: `Foto de ${r.nombre} actualizada.` });
    load();
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !form) return;
    const clean = (v: string) => v.trim() || null;
    const payload = {
      foto_url: form.foto_url,
      nombre: form.nombre.trim(),
      titulo: form.titulo.trim(),
      cita: form.cita.trim(),
      titulo_en: clean(form.titulo_en),
      cita_en: clean(form.cita_en),
      titulo_pt: clean(form.titulo_pt),
      cita_pt: clean(form.cita_pt),
      orden: Number(form.orden) || 0,
    };
    setBusy(true);
    const { error } =
      form.id === null
        ? await supabase.from('testimonios').insert(payload)
        : await supabase.from('testimonios').update(payload).eq('id', form.id);
    setBusy(false);
    if (error) return setMsg({ kind: 'error', text: friendlyError(error) });
    resetTestimonials();
    setMsg({ kind: 'ok', text: form.id === null ? 'Opinión agregada.' : 'Cambios guardados.' });
    setForm(null);
    load();
  };

  const remove = async (r: TestimonialRow) => {
    if (!supabase || !window.confirm(`¿Eliminar la opinión de ${r.nombre}?`)) return;
    const { error } = await supabase.from('testimonios').delete().eq('id', r.id);
    if (error) return setMsg({ kind: 'error', text: friendlyError(error) });
    resetTestimonials();
    setMsg({ kind: 'ok', text: 'Opinión eliminada.' });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted">
          {rows.length} {rows.length === 1 ? 'opinión' : 'opiniones'} · aparecen en la web en este orden
        </p>
        <Button
          className="ml-auto"
          onClick={() => {
            setMsg(null);
            setForm(emptyForm(rows.reduce((max, r) => Math.max(max, r.orden), 0) + 1));
          }}
        >
          + Nueva opinión
        </Button>
      </div>
      {msg && !form && <Alert kind={msg.kind}>{msg.text}</Alert>}

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {loading ? (
          <p className="p-10 text-center text-sm text-muted">Cargando opiniones…</p>
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted">Todavía no hay opiniones. Crea la primera.</p>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-sunken">
                  {r.foto_url ? (
                    <img src={r.foto_url} alt="" className="h-full w-full object-cover object-[50%_20%]" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted">Sin foto</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {r.nombre} <span className="font-normal text-muted">· {r.titulo}</span>
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-sm text-muted">{r.cita}</p>
                  <p className="mt-1 text-xs text-muted">
                    EN {r.titulo_en && r.cita_en ? '✓' : '—'} · PT {r.titulo_pt && r.cita_pt ? '✓' : '—'}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-1">
                  <label
                    className={cn(
                      'inline-flex h-8 cursor-pointer items-center rounded-lg border border-line bg-surface px-3 text-sm font-medium hover:bg-sunken focus-within:ring-2 focus-within:ring-info',
                      busyId === r.id && 'pointer-events-none opacity-60',
                    )}
                  >
                    {busyId === r.id ? 'Subiendo…' : r.foto_url ? 'Cambiar foto' : 'Subir foto'}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={busyId !== null}
                      onChange={(e) => {
                        quickChange(r, e.target.files?.[0]);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <Button variant="secondary" size="sm" onClick={() => edit(r)}>
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-danger" onClick={() => remove(r)}>
                    Eliminar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Formulario de opinión">
          <form onSubmit={save} className="max-h-full w-full max-w-2xl space-y-5 overflow-y-auto rounded-t-2xl bg-surface p-5 shadow-2xl sm:rounded-2xl sm:p-7">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">{form.id === null ? 'Nueva opinión' : 'Editar opinión'}</h2>
              <Button type="button" variant="ghost" size="sm" onClick={() => setForm(null)} aria-label="Cerrar">
                ✕
              </Button>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                uploadInForm(e.dataTransfer.files?.[0]);
              }}
              className={cn('flex flex-col items-center gap-4 rounded-xl border-2 border-dashed p-4 transition-colors sm:flex-row', dragging ? 'border-info bg-info/10' : 'border-line')}
            >
              <div className="h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-line bg-sunken">
                {form.foto_url ? (
                  <img src={form.foto_url} alt="Foto del cliente" className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted">Sin foto</div>
                )}
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <p className="text-sm font-medium">{dragging ? 'Suelta la imagen aquí' : 'Arrastra una foto aquí o'}</p>
                <label className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-line bg-surface px-3 text-sm font-medium hover:bg-sunken focus-within:ring-2 focus-within:ring-info">
                  {busy ? 'Subiendo…' : form.foto_url ? 'Cambiar foto' : 'Elegir archivo'}
                  <input type="file" accept="image/*" className="sr-only" disabled={busy} onChange={(e) => uploadInForm(e.target.files?.[0])} />
                </label>
                {form.foto_url && (
                  <button type="button" className="block w-full text-xs text-danger hover:underline sm:w-auto" onClick={() => set('foto_url', null)}>
                    Quitar foto
                  </button>
                )}
                <p className="text-xs text-muted">JPG, PNG o WebP · máx. 5 MB · se muestra en formato 4:3 (mejor si la cara está arriba y al centro)</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre del cliente">
                <Input required value={form.nombre} onChange={(e) => set('nombre', e.target.value)} placeholder="Ej: Carolina R." />
              </Field>
              <Field label="Orden" hint="Número menor = aparece primero.">
                <Input required type="number" value={form.orden} onChange={(e) => set('orden', e.target.value)} />
              </Field>
            </div>

            <fieldset className="space-y-3 rounded-xl border border-line p-4">
              <legend className="px-1 text-sm font-semibold">🇪🇸 Español</legend>
              <Field label="Título">
                <Input required value={form.titulo} onChange={(e) => set('titulo', e.target.value)} />
              </Field>
              <Field label="Opinión">
                <Textarea required value={form.cita} onChange={(e) => set('cita', e.target.value)} />
              </Field>
            </fieldset>

            <fieldset className="space-y-3 rounded-xl border border-line p-4">
              <legend className="px-1 text-sm font-semibold">🇺🇸 English (opcional)</legend>
              <Field label="Título" hint="Si lo dejas vacío, en inglés se muestra el texto en español.">
                <Input value={form.titulo_en} onChange={(e) => set('titulo_en', e.target.value)} />
              </Field>
              <Field label="Opinión">
                <Textarea value={form.cita_en} onChange={(e) => set('cita_en', e.target.value)} />
              </Field>
            </fieldset>

            <fieldset className="space-y-3 rounded-xl border border-line p-4">
              <legend className="px-1 text-sm font-semibold">🇵🇹 Português (opcional)</legend>
              <Field label="Título" hint="Si lo dejas vacío, en portugués se muestra el texto en español.">
                <Input value={form.titulo_pt} onChange={(e) => set('titulo_pt', e.target.value)} />
              </Field>
              <Field label="Opinión">
                <Textarea value={form.cita_pt} onChange={(e) => set('cita_pt', e.target.value)} />
              </Field>
            </fieldset>

            {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
            <div className="flex justify-end gap-2 border-t border-line pt-4">
              <Button type="button" variant="secondary" onClick={() => setForm(null)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? 'Guardando…' : 'Guardar'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
