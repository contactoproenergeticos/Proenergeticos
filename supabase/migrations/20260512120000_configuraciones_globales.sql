-- Tabla de configuración (tipo de cambio y otras claves globales).
-- La app lee tipo de cambio con: clave = 'tipo_cambio_usd_mxn' → valor_numerico

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

-- Columnas opcionales en estaciones (logos y texto de badge desde BD; permiso CRE para scripts)
alter table public.estaciones add column if not exists logo_url text;
alter table public.estaciones add column if not exists nota_badge text;
alter table public.estaciones add column if not exists permiso_cre text;
