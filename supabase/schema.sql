-- =====================================================================
-- G9 Auto Traders · esquema de inventario + panel de administración
-- Pégalo completo en Supabase → SQL Editor → Run. Es seguro volver a correrlo.
-- =====================================================================

-- ---------- 1. Tablas de catálogo ------------------------------------
create table if not exists public.marcas (
  id         bigint generated always as identity primary key,
  nombre     text not null unique check (length(trim(nombre)) > 0),
  created_at timestamptz not null default now()
);

-- Cada modelo pertenece a una marca (Sorento → KIA). El mismo nombre puede existir en marcas distintas.
create table if not exists public.modelos (
  id         bigint generated always as identity primary key,
  marca_id   bigint not null references public.marcas(id) on delete restrict,
  nombre     text not null check (length(trim(nombre)) > 0),
  created_at timestamptz not null default now(),
  unique (marca_id, nombre)
);

create table if not exists public.tipos_vehiculos (
  id         bigint generated always as identity primary key,
  nombre     text not null unique check (length(trim(nombre)) > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.combustibles (
  id         bigint generated always as identity primary key,
  nombre     text not null unique check (length(trim(nombre)) > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.transmisiones (
  id         bigint generated always as identity primary key,
  nombre     text not null unique check (length(trim(nombre)) > 0),
  created_at timestamptz not null default now()
);

-- "color" define el estilo de la insignia en la web: success | info | warning | danger | neutral
create table if not exists public.etiquetas (
  id         bigint generated always as identity primary key,
  nombre     text not null unique check (length(trim(nombre)) > 0),
  color      text not null default 'neutral'
             check (color in ('success', 'info', 'warning', 'danger', 'neutral')),
  created_at timestamptz not null default now()
);

-- ---------- 2. Vehículos ---------------------------------------------
create table if not exists public.vehiculos (
  id              bigint generated always as identity primary key,
  foto_url        text,
  modelo_id       bigint not null references public.modelos(id)        on delete restrict,
  anio            integer not null check (anio between 1950 and 2100),
  oferta_especial boolean not null default false,
  tipo_id         bigint not null references public.tipos_vehiculos(id) on delete restrict,
  combustible_id  bigint not null references public.combustibles(id)    on delete restrict,
  transmision_id  bigint          references public.transmisiones(id)   on delete restrict,
  etiqueta_id     bigint          references public.etiquetas(id)       on delete set null,
  precio          numeric(14, 0) not null check (precio >= 0),   -- pesos chilenos (CLP), sin decimales
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists modelos_marca_idx         on public.modelos (marca_id);
create index if not exists vehiculos_modelo_idx      on public.vehiculos (modelo_id);
create index if not exists vehiculos_tipo_idx        on public.vehiculos (tipo_id);
create index if not exists vehiculos_combustible_idx on public.vehiculos (combustible_id);
create index if not exists vehiculos_transmision_idx  on public.vehiculos (transmision_id);
create index if not exists vehiculos_etiqueta_idx    on public.vehiculos (etiqueta_id);
create index if not exists vehiculos_created_idx     on public.vehiculos (created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists vehiculos_updated_at on public.vehiculos;
create trigger vehiculos_updated_at
  before update on public.vehiculos
  for each row execute function public.set_updated_at();

-- ---------- 3. Administradores ---------------------------------------
-- Solo los usuarios listados aquí pueden modificar datos. Tener cuenta en Auth NO basta.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- 4. Seguridad (RLS) ---------------------------------------
alter table public.marcas          enable row level security;
alter table public.modelos         enable row level security;
alter table public.tipos_vehiculos enable row level security;
alter table public.combustibles    enable row level security;
alter table public.etiquetas       enable row level security;
alter table public.transmisiones    enable row level security;
alter table public.vehiculos       enable row level security;
alter table public.admins          enable row level security;

do $$
declare t text;
begin
  foreach t in array array['marcas', 'modelos', 'tipos_vehiculos', 'combustibles', 'etiquetas', 'transmisiones', 'vehiculos'] loop
    execute format('drop policy if exists "lectura publica" on public.%I', t);
    execute format('create policy "lectura publica" on public.%I for select using (true)', t);

    execute format('drop policy if exists "admin escribe" on public.%I', t);
    execute format(
      'create policy "admin escribe" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      t
    );
  end loop;
end $$;

-- Cada usuario solo puede ver su propia fila en admins (lo usa el panel para saber si tiene permiso).
drop policy if exists "ver mi fila" on public.admins;
create policy "ver mi fila" on public.admins for select to authenticated using (user_id = auth.uid());

-- ---------- 5. Fotos (Storage) ---------------------------------------
insert into storage.buckets (id, name, public)
values ('vehiculos', 'vehiculos', true)
on conflict (id) do update set public = true;

drop policy if exists "fotos lectura publica" on storage.objects;
create policy "fotos lectura publica" on storage.objects
  for select using (bucket_id = 'vehiculos');

drop policy if exists "fotos admin escribe" on storage.objects;
create policy "fotos admin escribe" on storage.objects
  for all to authenticated
  using (bucket_id = 'vehiculos' and public.is_admin())
  with check (bucket_id = 'vehiculos' and public.is_admin());

-- ---------- 6. Datos iniciales ---------------------------------------
insert into public.tipos_vehiculos (nombre) values
  ('Sedán'), ('SUV'), ('Camioneta'), ('Minivan'), ('Pickup')
on conflict (nombre) do nothing;

insert into public.combustibles (nombre) values
  ('Bencina'), ('Diésel'), ('Híbrido'), ('Eléctrico')
on conflict (nombre) do nothing;

insert into public.transmisiones (nombre) values
  ('Automática'), ('Manual')
on conflict (nombre) do nothing;

insert into public.etiquetas (nombre, color) values
  ('Disponible', 'success'), ('Por llegar', 'info'), ('Vendido', 'danger')
on conflict (nombre) do nothing;

insert into public.marcas (nombre) values
  ('KIA'), ('Hyundai'), ('Chevrolet'), ('Toyota'), ('BMW'), ('Mercedes-Benz')
on conflict (nombre) do nothing;

insert into public.modelos (marca_id, nombre)
select m.id, v.nombre
from (values
  ('KIA', 'Sorento'), ('KIA', 'Sportage'), ('KIA', 'Sportage 4x4'), ('KIA', 'Carnival'), ('KIA', 'Gran Carnival'),
  ('Hyundai', 'Tucson'), ('Hyundai', 'Santa Fe'), ('Hyundai', 'Santa Fe DM'),
  ('Chevrolet', 'Spark')
) as v(marca, nombre)
join public.marcas m on m.nombre = v.marca
on conflict (marca_id, nombre) do nothing;

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

-- ---------- 7. TU USUARIO ADMIN --------------------------------------
-- 1) Crea tu usuario en Authentication → Users → Add user (email + contraseña, marca "Auto Confirm User").
-- 2) Cambia el correo de abajo por el tuyo y ejecuta de nuevo solo esta sentencia:
insert into public.admins (user_id)
select id from auth.users where email = 'TU_CORREO@EJEMPLO.COM'
on conflict do nothing;
