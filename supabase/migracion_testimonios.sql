-- =====================================================================
-- Migración: opiniones de clientes con foto editable desde el panel admin.
-- Pégala en Supabase → SQL Editor → Run. Es seguro volver a correrla.
-- Requiere que ya hayas ejecutado schema.sql (usa public.is_admin()).
-- =====================================================================

-- ---------- Opiniones de clientes (testimonios) ----------------------
-- Las fotos se guardan en el mismo bucket público "vehiculos" (carpeta testimonios/).
create table if not exists public.testimonios (
  id         bigint generated always as identity primary key,
  nombre     text not null check (length(trim(nombre)) > 0),
  titulo     text not null check (length(trim(titulo)) > 0),
  cita       text not null check (length(trim(cita)) > 0),
  titulo_en  text,
  cita_en    text,
  titulo_pt  text,
  cita_pt    text,
  foto_url   text,
  orden      integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.testimonios enable row level security;

drop policy if exists "lectura publica" on public.testimonios;
create policy "lectura publica" on public.testimonios for select using (true);

drop policy if exists "admin escribe" on public.testimonios;
create policy "admin escribe" on public.testimonios for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Opiniones iniciales (solo si la tabla está vacía) para poder editarlas desde el panel.
insert into public.testimonios (nombre, titulo, cita, titulo_en, cita_en, titulo_pt, cita_pt, orden, foto_url)
select * from (values
  ('Miguel Á. C.', 'Son gran empresa',
   'Compré mi KIA Sorento sin salir de Iquique. Me explicaron cada paso del financiamiento y el auto llegó en la fecha que me dijeron.',
   'A great company',
   'I bought my KIA Sorento without leaving Iquique. They explained every step of the financing and the car arrived on the date they promised.',
   'Uma ótima empresa',
   'Comprei meu KIA Sorento sem sair de Iquique. Explicaram cada etapa do financiamento e o carro chegou na data combinada.', 1, '/testimonios/miguel.jpg'),
  ('Carolina R.', 'Atención impecable',
   'Desde la primera llamada me trataron con paciencia. Revisaron el historial del auto y me mostraron cada detalle antes de firmar.',
   'Impeccable service',
   'From the first call they treated me with patience. They reviewed the car''s history and showed me every detail before I signed.',
   'Atendimento impecável',
   'Desde a primeira ligação fui tratado com paciência. Revisaram o histórico do carro e me mostraram cada detalhe antes de assinar.', 2, '/testimonios/carolina.jpg'),
  ('Patricia M.', 'Agradecida por todo',
   'Fuimos con mi hijo a buscar una minivan familiar. Salimos con el auto, los papeles listos y una garantía clara por escrito.',
   'Grateful for everything',
   'My son and I went looking for a family minivan. We left with the car, the paperwork ready and a clear written warranty.',
   'Grata por tudo',
   'Fomos com meu filho procurar uma minivan familiar. Saímos com o carro, a documentação pronta e uma garantia clara por escrito.', 3, '/testimonios/patricia.jpg'),
  ('Andrea L.', 'Muy recomendable',
   'Importaron un vehículo desde Corea con todo el trámite incluido. Transparencia de principio a fin.',
   'Highly recommended',
   'They imported a vehicle from Korea with all the paperwork included. Transparency from start to finish.',
   'Muito recomendável',
   'Importaram um veículo da Coreia com todos os trâmites incluídos. Transparência do início ao fim.', 4, '/testimonios/andrea.jpg')
) as v(nombre, titulo, cita, titulo_en, cita_en, titulo_pt, cita_pt, orden, foto_url)
where not exists (select 1 from public.testimonios);

-- Si ya habías ejecutado la versión anterior: pone las fotos nuevas (solo a opiniones que aún no tienen foto)
-- y corrige "Patricio" por "Patricia", porque la foto asignada es de una mujer. No toca opiniones que ya editaste.
update public.testimonios set foto_url = '/testimonios/miguel.jpg'   where nombre = 'Miguel Á. C.' and foto_url is null;
update public.testimonios set foto_url = '/testimonios/carolina.jpg' where nombre = 'Carolina R.'  and foto_url is null;
update public.testimonios set foto_url = '/testimonios/andrea.jpg'   where nombre = 'Andrea L.'    and foto_url is null;
update public.testimonios
   set nombre = 'Patricia M.', titulo = 'Agradecida por todo', titulo_pt = 'Grata por tudo',
       foto_url = coalesce(foto_url, '/testimonios/patricia.jpg')
 where nombre = 'Patricio M.' and titulo = 'Agradecido por todo';

