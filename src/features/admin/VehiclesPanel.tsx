import { useCallback, useEffect, useState } from 'react';
import { PHOTO_BUCKET, supabase } from '../../lib/supabase';
import { formatCLP, type Lookup, type Modelo, type Tag } from '../../lib/inventory';
import { Button } from '../../components/ui';
import { cn } from '../../lib/cn';
import { Alert, Field, Input, Select, friendlyError } from './fields';
import { tagStyle } from './LookupPanel';

interface Row {
  id: number;
  foto_url: string | null;
  modelo_id: number;
  anio: number;
  oferta_especial: boolean;
  tipo_id: number;
  combustible_id: number;
  transmision_id: number | null;
  etiqueta_id: number | null;
  precio: number;
}

interface Form {
  id: number | null;
  foto_url: string | null;
  marca_id: string; // only used to filter the model list; the brand is stored through the model
  modelo_id: string;
  anio: string;
  oferta_especial: boolean;
  tipo_id: string;
  combustible_id: string;
  transmision_id: string;
  etiqueta_id: string;
  precio: string; // digits only
}

const emptyForm = (): Form => ({
  id: null,
  foto_url: null,
  marca_id: '',
  modelo_id: '',
  anio: String(new Date().getFullYear()),
  oferta_especial: false,
  tipo_id: '',
  combustible_id: '',
  transmision_id: '',
  etiqueta_id: '',
  precio: '',
});

interface Props {
  marcas: Lookup[];
  modelos: Modelo[];
  tipos: Lookup[];
  combustibles: Lookup[];
  transmisiones: Lookup[];
  etiquetas: Tag[];
}

const MAX_PHOTO = 5 * 1024 * 1024;

export function VehiclesPanel({ marcas, modelos, tipos, combustibles, transmisiones, etiquetas }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null);
  const [query, setQuery] = useState('');
  const [dragging, setDragging] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('vehiculos').select('*').order('created_at', { ascending: false });
    if (error) setMsg({ kind: 'error', text: friendlyError(error) });
    setRows(((data as Row[]) ?? []).map((r) => ({ ...r, precio: Number(r.precio) })));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const name = (list: Lookup[], id: number | null) => list.find((x) => x.id === id)?.nombre ?? '—';
  const tag = (id: number | null) => etiquetas.find((x) => x.id === id);
  const modeloOf = (id: number) => modelos.find((x) => x.id === id);
  const label = (r: Row) => {
    const m = modeloOf(r.modelo_id);
    return m ? `${name(marcas, m.marca_id)} ${m.nombre}` : '—';
  };

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => (f ? { ...f, [key]: value } : f));

  const edit = (r: Row) => {
    setMsg(null);
    setForm({
      id: r.id,
      foto_url: r.foto_url,
      marca_id: String(modeloOf(r.modelo_id)?.marca_id ?? ''),
      modelo_id: String(r.modelo_id),
      anio: String(r.anio),
      oferta_especial: r.oferta_especial,
      tipo_id: String(r.tipo_id),
      combustible_id: String(r.combustible_id),
      transmision_id: r.transmision_id ? String(r.transmision_id) : '',
      etiqueta_id: r.etiqueta_id ? String(r.etiqueta_id) : '',
      precio: String(r.precio),
    });
  };

  const upload = async (file: File | undefined) => {
    if (!file || !supabase) return;
    if (!file.type.startsWith('image/')) return setMsg({ kind: 'error', text: 'El archivo debe ser una imagen.' });
    if (file.size > MAX_PHOTO) return setMsg({ kind: 'error', text: 'La foto pesa más de 5 MB.' });
    setBusy(true);
    setMsg(null);
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file, { cacheControl: '31536000' });
    setBusy(false);
    if (error) return setMsg({ kind: 'error', text: friendlyError(error) });
    set('foto_url', supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !form) return;
    const payload = {
      foto_url: form.foto_url,
      modelo_id: Number(form.modelo_id),
      anio: Number(form.anio),
      oferta_especial: form.oferta_especial,
      tipo_id: Number(form.tipo_id),
      combustible_id: Number(form.combustible_id),
      transmision_id: Number(form.transmision_id),
      etiqueta_id: form.etiqueta_id ? Number(form.etiqueta_id) : null,
      precio: Number(form.precio || 0),
    };
    setBusy(true);
    const { error } =
      form.id === null
        ? await supabase.from('vehiculos').insert(payload)
        : await supabase.from('vehiculos').update(payload).eq('id', form.id);
    setBusy(false);
    if (error) return setMsg({ kind: 'error', text: friendlyError(error) });
    setMsg({ kind: 'ok', text: form.id === null ? 'Vehículo agregado.' : 'Cambios guardados.' });
    setForm(null);
    load();
  };

  const remove = async (r: Row) => {
    if (!supabase || !window.confirm(`¿Eliminar ${label(r)} ${r.anio}?`)) return;
    const { error } = await supabase.from('vehiculos').delete().eq('id', r.id);
    if (error) return setMsg({ kind: 'error', text: friendlyError(error) });
    setMsg({ kind: 'ok', text: 'Vehículo eliminado.' });
    load();
  };

  const q = query.trim().toLowerCase();
  const filtered = q
    ? rows.filter((r) => `${label(r)} ${r.anio}`.toLowerCase().includes(q))
    : rows;
  const missingCatalog = marcas.length === 0 || modelos.length === 0 || tipos.length === 0 || combustibles.length === 0 || transmisiones.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          type="search"
          placeholder="Buscar por marca, modelo o año…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
          aria-label="Buscar vehículo"
        />
        <span className="text-sm text-muted">
          {filtered.length} {filtered.length === 1 ? 'vehículo' : 'vehículos'}
        </span>
        <Button className="ml-auto" disabled={missingCatalog} onClick={() => { setMsg(null); setForm(emptyForm()); }}>
          + Nuevo vehículo
        </Button>
      </div>
      {missingCatalog && !loading && (
        <Alert kind="error">Antes de crear vehículos agrega al menos una marca, un modelo, un tipo, un combustible y una transmisión.</Alert>
      )}
      {msg && !form && <Alert kind={msg.kind}>{msg.text}</Alert>}

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {loading ? (
          <p className="p-10 text-center text-sm text-muted">Cargando inventario…</p>
        ) : filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted">
            {rows.length === 0 ? 'Todavía no hay vehículos. Crea el primero.' : 'Sin resultados para esa búsqueda.'}
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {filtered.map((r) => {
              const t = tag(r.etiqueta_id);
              return (
                <li key={r.id} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-sunken">
                    {r.foto_url ? (
                      <img src={r.foto_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted">Sin foto</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {label(r)} <span className="font-normal text-muted">· {r.anio}</span>
                    </p>
                    <p className="mt-0.5 truncate text-sm text-muted">
                      {name(tipos, r.tipo_id)} · {name(combustibles, r.combustible_id)} · {name(transmisiones, r.transmision_id)}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {t && <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', tagStyle[t.color])}>{t.nombre}</span>}
                      {r.oferta_especial && (
                        <span className="rounded-md bg-danger px-2 py-0.5 text-xs font-medium text-canvas">Oferta especial</span>
                      )}
                    </div>
                  </div>
                  <p className="text-lg font-semibold tabular-nums">{formatCLP(r.precio)}</p>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="secondary" size="sm" onClick={() => edit(r)}>
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" className="text-danger" onClick={() => remove(r)}>
                      Eliminar
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Formulario de vehículo">
          <form
            onSubmit={save}
            className="max-h-full w-full max-w-2xl space-y-5 overflow-y-auto rounded-t-2xl bg-surface p-5 shadow-2xl sm:rounded-2xl sm:p-7"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">{form.id === null ? 'Nuevo vehículo' : 'Editar vehículo'}</h2>
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
                upload(e.dataTransfer.files?.[0]);
              }}
              className={cn(
                'flex flex-col items-center gap-4 rounded-xl border-2 border-dashed p-4 transition-colors sm:flex-row',
                dragging ? 'border-info bg-info/10' : 'border-line',
              )}
            >
              <div className="h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-line bg-sunken">
                {form.foto_url ? (
                  <img src={form.foto_url} alt="Foto del vehículo" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted">Sin foto</div>
                )}
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <p className="text-sm font-medium">
                  {dragging ? 'Suelta la imagen aquí' : 'Arrastra una foto aquí o'}
                </p>
                <label className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-line bg-surface px-3 text-sm font-medium hover:bg-sunken focus-within:ring-2 focus-within:ring-info">
                  {busy ? 'Subiendo…' : form.foto_url ? 'Cambiar foto' : 'Elegir archivo'}
                  <input type="file" accept="image/*" className="sr-only" disabled={busy} onChange={(e) => upload(e.target.files?.[0])} />
                </label>
                {form.foto_url && (
                  <button type="button" className="block w-full text-xs text-danger hover:underline sm:w-auto" onClick={() => set('foto_url', null)}>
                    Quitar foto
                  </button>
                )}
                <p className="text-xs text-muted">JPG, PNG o WebP · máx. 5 MB</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Marca">
                <Select required value={form.marca_id} onChange={(e) => setForm((f) => (f ? { ...f, marca_id: e.target.value, modelo_id: '' } : f))}>
                  <option value="">Selecciona…</option>
                  {marcas.map((m) => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Modelo">
                <Select required value={form.modelo_id} disabled={!form.marca_id} onChange={(e) => set('modelo_id', e.target.value)}>
                  <option value="">{form.marca_id ? 'Selecciona…' : 'Primero elige una marca'}</option>
                  {modelos
                    .filter((m) => String(m.marca_id) === form.marca_id)
                    .map((m) => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                </Select>
              </Field>
              <Field label="Año">
                <Input required type="number" min={1950} max={2100} value={form.anio} onChange={(e) => set('anio', e.target.value)} />
              </Field>
              <Field label="Precio (CLP)">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">$</span>
                  <Input
                    required
                    inputMode="numeric"
                    className="pl-7 tabular-nums"
                    value={form.precio ? Number(form.precio).toLocaleString('es-CL') : ''}
                    onChange={(e) => set('precio', e.target.value.replace(/\D/g, '').slice(0, 12))}
                    placeholder="0"
                  />
                </div>
              </Field>
              <Field label="Tipo">
                <Select required value={form.tipo_id} onChange={(e) => set('tipo_id', e.target.value)}>
                  <option value="">Selecciona…</option>
                  {tipos.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Combustible">
                <Select required value={form.combustible_id} onChange={(e) => set('combustible_id', e.target.value)}>
                  <option value="">Selecciona…</option>
                  {combustibles.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Transmisión">
                <Select required value={form.transmision_id} onChange={(e) => set('transmision_id', e.target.value)}>
                  <option value="">Selecciona…</option>
                  {transmisiones.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Etiqueta">
                <Select value={form.etiqueta_id} onChange={(e) => set('etiqueta_id', e.target.value)}>
                  <option value="">Sin etiqueta</option>
                  {etiquetas.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </Select>
              </Field>
              <label className="flex cursor-pointer items-center gap-3 self-end rounded-lg border border-line px-3 py-2.5 text-sm font-medium">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[rgb(var(--color-danger))]"
                  checked={form.oferta_especial}
                  onChange={(e) => set('oferta_especial', e.target.checked)}
                />
                Oferta especial
              </label>
            </div>

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
