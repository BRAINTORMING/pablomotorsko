import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Lookup, Modelo } from '../../lib/inventory';
import { Button } from '../../components/ui';
import { Alert, Field, Input, Select, friendlyError } from './fields';

interface Props {
  marcas: Lookup[];
  modelos: Modelo[];
  onChanged: () => void;
}

/** Add / rename / delete car models. Every model belongs to one brand. */
export function ModelosPanel({ marcas, modelos, onChanged }: Props) {
  const [marcaId, setMarcaId] = useState('');
  const [nombre, setNombre] = useState('');
  const [editing, setEditing] = useState<number | null>(null);
  const [filter, setFilter] = useState('');
  const [msg, setMsg] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const marcaName = (id: number) => marcas.find((m) => m.id === id)?.nombre ?? '—';
  const reset = () => {
    setNombre('');
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
    if (!supabase || !nombre.trim() || !marcaId) return;
    const row = { marca_id: Number(marcaId), nombre: nombre.trim() };
    if (editing === null) run(supabase.from('modelos').insert(row), 'Modelo agregado.');
    else run(supabase.from('modelos').update(row).eq('id', editing), 'Modelo actualizado.');
  };

  const remove = (m: Modelo) => {
    if (!supabase || !window.confirm(`¿Eliminar "${marcaName(m.marca_id)} ${m.nombre}"?`)) return;
    run(supabase.from('modelos').delete().eq('id', m.id), 'Modelo eliminado.');
  };

  const startEdit = (m: Modelo) => {
    setEditing(m.id);
    setMarcaId(String(m.marca_id));
    setNombre(m.nombre);
    setMsg(null);
  };

  const shown = (filter ? modelos.filter((m) => String(m.marca_id) === filter) : modelos)
    .slice()
    .sort((a, b) => marcaName(a.marca_id).localeCompare(marcaName(b.marca_id)) || a.nombre.localeCompare(b.nombre));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
      <form onSubmit={submit} className="h-fit space-y-4 rounded-2xl border border-line bg-surface p-5">
        <h3 className="font-semibold">{editing === null ? 'Nuevo modelo' : 'Editar modelo'}</h3>
        <Field label="Marca">
          <Select required value={marcaId} onChange={(e) => setMarcaId(e.target.value)}>
            <option value="">Selecciona…</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </Select>
        </Field>
        <Field label="Nombre del modelo">
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required maxLength={80} />
        </Field>
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
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <span className="text-sm text-muted">Modelos · {shown.length}</span>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-9 w-44" aria-label="Filtrar por marca">
            <option value="">Todas las marcas</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </Select>
        </div>
        {shown.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">Aún no hay modelos.</p>
        ) : (
          <ul className="divide-y divide-line">
            {shown.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <span className="min-w-0 truncate">
                  <span className="font-medium">{m.nombre}</span> <span className="text-sm text-muted">· {marcaName(m.marca_id)}</span>
                </span>
                <span className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(m)}>Editar</Button>
                  <Button variant="ghost" size="sm" className="text-danger" onClick={() => remove(m)}>Eliminar</Button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
