import { lazy, Suspense, useEffect, useState } from 'react';
import { HomePage } from './features/home/HomePage';

// The admin panel (and the Supabase auth code it needs) only downloads when someone opens #/admin.
const AdminPage = lazy(() => import('./features/admin/AdminPage'));

const isAdminRoute = () => window.location.hash.startsWith('#/admin');

/** Root component. Tiny hash router: "#/admin" shows the admin panel, anything else is the public site. */
export default function App() {
  const [admin, setAdmin] = useState(isAdminRoute);

  useEffect(() => {
    const onHash = () => {
      setAdmin(isAdminRoute());
      if (!isAdminRoute() && window.location.hash === '#/') window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (admin)
    return (
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-muted">Cargando…</div>}>
        <AdminPage />
      </Suspense>
    );
  return <HomePage />;
}
