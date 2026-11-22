# Facet app

Starter structure. Every folder has one job, so the project stays easy to read as it grows.

    src/
      main.tsx            entry point: mounts <AppProviders><App/></AppProviders>
      App.tsx             root component (pick the page to show here)
      index.css           design tokens (light / dark) and the page texture
      config/             constants and copy: site.ts
      lib/                pure helpers with no React: cn.ts
      hooks/              reusable hooks: useTheme, useMediaQuery
      providers/          React context providers: ThemeProvider, AppProviders
      components/
        ui/               small building blocks with variants: Button, Card, Heading, Text
        layout/           page structure: Page
        Logo.tsx          the Facet logo
        ErrorBoundary.tsx keeps a crash from blanking the whole page
      features/<name>/    one folder per product area, with its own components
      types/              shared TypeScript types

Rules

- Colors, borders and surfaces come from the design tokens (bg-surface, text-fg, border-line, bg-action...). Never
  write a color by hand: that is what makes dark mode work everywhere.
- A component used in more than one place goes to components/ui. A component used by one feature stays inside it.
- Features import from components, hooks, lib and config. Components never import from features.
- Text that may change (names, slogans, links) lives in config, not inside components.
- Use cn() from lib/cn.ts to join class names.


## Panel de administración (Supabase)

1. En Supabase → SQL Editor pega y ejecuta `supabase/schema.sql` (antes cambia `TU_CORREO@EJEMPLO.COM` por tu correo y crea ese usuario en Authentication → Users).
2. Copia `.env.example` a `.env` y completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
3. `npm install && npm run dev` y abre `/#/admin`.

## Opiniones de clientes (con foto editable)

1. Si ya habías ejecutado `schema.sql` antes, pega y ejecuta solo `supabase/migracion_testimonios.sql` en el SQL Editor (crea la tabla `testimonios` y 4 opiniones iniciales). Si instalas desde cero, `schema.sql` ya lo incluye.
2. En `/#/admin` → pestaña **Opiniones**: "Cambiar foto" en cada fila sube la foto y la publica al instante; "Editar" permite cambiar nombre, textos, orden y las traducciones EN/PT.

## Idiomas (ES / EN / PT)

- Los textos viven en `src/i18n/es.ts`, `en.ts` y `pt.ts` (misma estructura; TypeScript avisa si falta una clave).
- Las banderas del header cambian el idioma y se recuerda en el navegador.
- Los valores que vienen de la base (etiquetas, tipos, combustibles, transmisiones) se traducen con `values` en cada archivo de idioma. Si agregas uno nuevo desde el admin, añade su traducción ahí; mientras tanto se muestra tal cual.

## WhatsApp

El número está en `src/data/dealership.ts` (`contact.whatsapp`, solo dígitos con código de país: `56983883844`).

## Hero con fotos que cambian

`src/features/home/components/HeroBackground.tsx`: la lista `SLIDES` define las fotos (archivos en `src/assets/`) y `HOLD_MS` cuánto dura cada una. Para agregar una foto, ponla en `src/assets/` (idealmente 1000 px de ancho o más) e impórtala ahí.

## Logo

`src/assets/g9-auto-traders.jpg` (header y hero) y `public/favicon.png`. El logo es oscuro sobre blanco, por eso se muestra dentro de un panel blanco.
