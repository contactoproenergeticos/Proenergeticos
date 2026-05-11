-- Esquema relacional: estaciones (1) → precios_combustible (N).
-- Ejecutar en Supabase SQL editor en proyectos nuevos o como referencia.

create extension if not exists "pgcrypto";

create table if not exists public.estaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  marca text,
  orden integer not null default 0
);

create table if not exists public.precios_combustible (
  id uuid primary key default gen_random_uuid(),
  estacion_id uuid not null references public.estaciones (id) on delete cascade,
  label text not null,
  subtitulo text,
  precio numeric,
  updated_at timestamptz not null default now()
);

create index if not exists precios_combustible_estacion_id_idx
  on public.precios_combustible (estacion_id);

create index if not exists precios_combustible_updated_at_idx
  on public.precios_combustible (updated_at desc);

alter table public.estaciones enable row level security;
alter table public.precios_combustible enable row level security;

drop policy if exists "estaciones_select_anon" on public.estaciones;
create policy "estaciones_select_anon" on public.estaciones
  for select using (true);

drop policy if exists "precios_combustible_select_anon" on public.precios_combustible;
create policy "precios_combustible_select_anon" on public.precios_combustible
  for select using (true);

-- Semilla (solo si aún no existen esas estaciones por nombre)
insert into public.estaciones (nombre, marca, orden)
select 'Santa Irene (GSI)', 'Estación Blast', 1
where not exists (select 1 from public.estaciones where nombre = 'Santa Irene (GSI)');

insert into public.estaciones (nombre, marca, orden)
select 'El Pozole (GPO)', 'Grupo Proenergéticos Oil Companies', 2
where not exists (select 1 from public.estaciones where nombre = 'El Pozole (GPO)');

insert into public.precios_combustible (estacion_id, label, subtitulo, precio, updated_at)
select e.id, v.label, v.subtitulo, v.precio::numeric, now()
from public.estaciones e
cross join lateral (
  values
    ('Magna (Blast)', '87 Octanos', '22.79'),
    ('Premium (Blast)', '91 Octanos', '26.39'),
    ('Diésel', 'UBA', '27.39')
) as v(label, subtitulo, precio)
where e.nombre = 'Santa Irene (GSI)'
  and not exists (
    select 1 from public.precios_combustible p
    where p.estacion_id = e.id and p.label = v.label
  );

insert into public.precios_combustible (estacion_id, label, subtitulo, precio, updated_at)
select e.id, v.label, v.subtitulo, v.precio::numeric, now()
from public.estaciones e
cross join lateral (
  values
    ('Gasolina Magna', 'Aditivada', '23.24'),
    ('Gasolina Premium', 'Máximo Desempeño', '28.98'),
    ('Diésel', 'Industrial', '25.40')
) as v(label, subtitulo, precio)
where e.nombre = 'El Pozole (GPO)'
  and not exists (
    select 1 from public.precios_combustible p
    where p.estacion_id = e.id and p.label = v.label
  );
