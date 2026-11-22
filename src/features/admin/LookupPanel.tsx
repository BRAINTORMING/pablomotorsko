import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Lookup, Tag, TagColor } from '../../lib/inventory';
import { Button } from '../../components/ui';
import { cn } from '../../lib/cn';
import { Alert, Field, Input, Select, friendlyError } from './fields';

export const tagStyle: Record<TagColor, string> = {
  success: 'bg-success/15 text-success',
  info: 'bg-info/15 text-info',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  neutral: 'bg-sunken text-muted',
};
const colorLabel: Record<TagColor, string> = {
  success: 'Verde',
  info: 'Azul',
  warning: 'Ámbar',
  danger: 'Rojo',
  neutral: 'Gris',
};

type Table = 'marcas' | 'tipos_vehiculos' | 'combustibles' | 'transmisiones' | 'etiquetas';

interface Props {
  table: Table;
  title: string;
  singular: string;
  items: (Lookup | Tag)[];
  onChanged: () => void;
}

/** Add / rename / delete for the small catalog tables (marcas, tipos, combustibles, etiquetas). */
export function LookupPanel({ table, title, singular, items, onChanged }: Props) {
  const withColor = table === 'etiquetas';
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState<TagColor>('neutral');
  const [editing, setEditing] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setNombre('');
    setColor('neutral');
    setEditing(null);
  };

  const run = async (job: PromiseLike<{ error: { code?: string; message: string } | null }>, ok: string) => {
    setBusy(true);
    const { error } = await job;
    setBusy(false);
    if (error) return setMsg({ kind: 'error', text: friendlyError(error) });
    setMsg({ kind: 'ok', text: ok });
    reset();
    onChanged();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !nombre.trim()) return;
    const row = withColor ? { nombre: nombre.trim(), color } : { nombre: nombre.trim() };
    if (editing === null) run(supabase.from(table).insert(row), `${singular} agregado.`);
    else run(supabase.from(table).update(row).eq('id', editing), `${singular} actualizado.`);
  };

  const remove = (item: Lookup) => {
    if (!supabase || !window.confirm(`¿Eliminar "${item.nombre}"?`)) return;
    run(supabase.from(table).delete().eq('id', item.id), `${singular} eliminado.`);
  };

  const startEdit = (item: Lookup | Tag) => {
    setEditing(item.id);
    setNombre(item.nombre);
    if ('color' in item) setColor(item.color);
    setMsg(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
      <form onSubmit={submit} className="h-fit space-y-4 rounded-2xl border border-line bg-surface p-5">
        <h3 className="font-semibold">{editing === null ? `Nuevo ${singular.toLowerCase()}` : `Editar ${singular.toLowerCase()}`}</h3>
        <Field label="Nombre">
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required maxLength={60} />
        </Field>
        {withColor && (
          <Field label="Color de la insignia">
            <Select value={color} onChange={(e) => setColor(e.target.value as TagColor)}>
              {(Object.keys(colorLabel) as TagColor[]).map((c) => (
                <option key={c} value={c}>
                  {colorLabel[c]}
                </option>
              ))}
            </Select>
          </Field>
        )}
        {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
        <div className="flex gap-2">
          <Button type="submit" disabled={busy} className="flex-1">
            {editing === null ? 'Agregar' : 'Guardar'}
          </Button>
          {editing !== null && (
            <Button type="button" variant="secondary" onClick={reset}>
              Cancelar
            </Button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="border-b border-line px-5 py-3 text-sm text-muted">
          {title} · {items.length}
        </div>
        {items.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">Aún no hay registros.</p>
        ) : (
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate font-medium">{item.nombre}</span>
                  {'color' in item && (
                    <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', tagStyle[item.color])}>
                      {colorLabel[item.color]}
                    </span>
                  )}
                </span>
                <span className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(item)}>
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-danger" onClick={() => remove(item)}>
                    Eliminar
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
