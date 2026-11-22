import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from '../../lib/supabase';
import { useCatalogs } from '../../lib/inventory';
import { Button } from '../../components/ui';
import { cn } from '../../lib/cn';
import { LoginForm } from './LoginForm';
import { LookupPanel } from './LookupPanel';
import { ModelosPanel } from './ModelosPanel';
import { VehiclesPanel } from './VehiclesPanel';
import { TestimoniosPanel } from './TestimoniosPanel';

type TabId = 'vehiculos' | 'testimonios' | 'marcas' | 'modelos' | 'tipos' | 'combustibles' | 'transmisiones' | 'etiquetas';
const tabs: { id: TabId; label: string }[] = [
  { id: 'vehiculos', label: 'Vehículos' },
  { id: 'testimonios', label: 'Opiniones' },
  { id: 'marcas', label: 'Marcas' },
  { id: 'modelos', label: 'Modelos' },
  { id: 'tipos', label: 'Tipos' },
  { id: 'combustibles', label: 'Combustibles' },
  { id: 'transmisiones', label: 'Transmisiones' },
  { id: 'etiquetas', label: 'Etiquetas' },
];

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 text-fg">
      <div className="max-w-md space-y-3 text-center">{children}</div>
    </div>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(!supabaseConfigured);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !session) return setIsAdmin(null);
    let alive = true;
    supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => alive && setIsAdmin(Boolean(data)));
    return () => {
      alive = false;
    };
  }, [session]);

  if (!supabaseConfigured)
    return (
      <Screen>
        <h1 className="text-xl font-bold">Falta conectar Supabase</h1>
        <p className="text-sm text-muted">
          Crea un archivo <code className="rounded bg-sunken px-1">.env</code> con <code className="rounded bg-sunken px-1">VITE_SUPABASE_URL</code> y{' '}
          <code className="rounded bg-sunken px-1">VITE_SUPABASE_ANON_KEY</code> (mira <code>.env.example</code>) y reinicia el servidor.
        </p>
        <a href="#/" className="text-sm underline">Volver al sitio</a>
      </Screen>
    );
  if (!ready) return <Screen><p className="text-sm text-muted">Cargando…</p></Screen>;
  if (!session) return <LoginForm />;
  if (isAdmin === null) return <Screen><p className="text-sm text-muted">Verificando permisos…</p></Screen>;
  if (!isAdmin)
    return (
      <Screen>
        <h1 className="text-xl font-bold">Sin acceso</h1>
        <p className="text-sm text-muted">
          La cuenta <strong>{session.user.email}</strong> existe, pero no está autorizada como administrador. Agrégala a la tabla{' '}
          <code className="rounded bg-sunken px-1">admins</code> (paso 7 del SQL).
        </p>
        <Button variant="secondary" onClick={() => supabase!.auth.signOut()}>Cerrar sesión</Button>
      </Screen>
    );

  return <Dashboard email={session.user.email ?? ''} />;
}

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<TabId>('vehiculos');
  const cat = useCatalogs();

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <header className="sticky top-0 z-30 border-b border-on-brand/10 bg-brand text-on-brand">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <p className="font-bold tracking-tight">
            G9 AUTO TRADERS <span className="font-normal text-on-brand/60">· Admin</span>
          </p>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-on-brand/70 sm:inline">{email}</span>
            <a href="#/" className="text-on-brand/80 hover:text-on-brand">Ver sitio</a>
            <button
              type="button"
              onClick={() => supabase!.auth.signOut()}
              className="rounded-md border border-on-brand/20 px-3 py-1.5 hover:bg-on-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div role="tablist" aria-label="Secciones" className="flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'h-9 shrink-0 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info',
                tab === t.id ? 'bg-action text-on-action' : 'text-muted hover:bg-sunken hover:text-fg',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'vehiculos' && <VehiclesPanel marcas={cat.marcas} modelos={cat.modelos} tipos={cat.tipos} combustibles={cat.combustibles} transmisiones={cat.transmisiones} etiquetas={cat.etiquetas} />}
        {tab === 'testimonios' && <TestimoniosPanel />}
        {tab === 'marcas' && <LookupPanel table="marcas" title="Marcas" singular="Marca" items={cat.marcas} onChanged={cat.reload} />}
        {tab === 'modelos' && <ModelosPanel marcas={cat.marcas} modelos={cat.modelos} onChanged={cat.reload} />}
        {tab === 'tipos' && <LookupPanel table="tipos_vehiculos" title="Tipos de vehículo" singular="Tipo" items={cat.tipos} onChanged={cat.reload} />}
        {tab === 'combustibles' && <LookupPanel table="combustibles" title="Combustibles" singular="Combustible" items={cat.combustibles} onChanged={cat.reload} />}
        {tab === 'transmisiones' && <LookupPanel table="transmisiones" title="Transmisiones" singular="Transmisión" items={cat.transmisiones} onChanged={cat.reload} />}
        {tab === 'etiquetas' && <LookupPanel table="etiquetas" title="Etiquetas" singular="Etiqueta" items={cat.etiquetas} onChanged={cat.reload} />}
      </main>
    </div>
  );
}
