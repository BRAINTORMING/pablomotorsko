import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui';
import { Alert, Field, Input } from './fields';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (err) setError(err.message === 'Invalid login credentials' ? 'Correo o contraseña incorrectos.' : err.message);
    setBusy(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand px-4 py-12 text-fg">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-2xl sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">G9 AUTO TRADERS</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Panel de administración</h1>
          <p className="mt-1 text-sm text-muted">Ingresa con tu cuenta de administrador.</p>
        </div>
        <Field label="Correo">
          <Input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Contraseña">
          <Input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        {error && <Alert kind="error">{error}</Alert>}
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? 'Ingresando…' : 'Ingresar'}
        </Button>
        <a href="#/" className="block text-center text-sm text-muted hover:text-fg">
          ← Volver al sitio
        </a>
      </form>
    </div>
  );
}
