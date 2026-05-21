-- Ejecutar en Supabase → SQL Editor (proyecto de Proenergéticos).
-- Crea configuraciones_globales, modo de captura y columnas de vigencia en precios.

create extension if not exists "pgcrypto";

-- 1) Tabla de configuración global
create table if not exists public.configuraciones_globales (
  id uuid primary key default gen_random_uuid(),
  clave text not null unique,
  valor_numerico numeric,
  valor_texto text,
  updated_at timestamptz not null default now()
);

create index if not exists configuraciones_globales_clave_idx
  on public.configuraciones_globales (clave);

alter table public.configuraciones_globales enable row level security;

drop policy if exists "configuraciones_globales_select_anon" on public.configuraciones_globales;
create policy "configuraciones_globales_select_anon" on public.configuraciones_globales
  for select using (true);

-- 2) Modo automático / manual del panel admin-precios
insert into public.configuraciones_globales (clave, valor_texto)
values ('precios_modo_captura', 'automatico')
on conflict (clave) do nothing;

-- 3) Columnas de vigencia en precios (si aún no existen)
alter table public.precios_combustible
  add column if not exists fecha_actualizacion varchar,
  add column if not exists hora_actualizacion varchar;

-- 4) Permiso CRE en estaciones (sync automático)
alter table public.estaciones add column if not exists permiso_cre text;
alter table public.estaciones add column if not exists logo_url text;
alter table public.estaciones add column if not exists nota_badge text;

-- 5) Contador de visitas del sitio público
create table if not exists public.visitas_sitio (
  id uuid primary key default gen_random_uuid(),
  session_key text not null,
  path text not null default '/',
  created_at timestamptz not null default now(),
  constraint visitas_sitio_session_key_unique unique (session_key)
);

create index if not exists visitas_sitio_created_at_idx
  on public.visitas_sitio (created_at desc);

alter table public.visitas_sitio enable row level security;
