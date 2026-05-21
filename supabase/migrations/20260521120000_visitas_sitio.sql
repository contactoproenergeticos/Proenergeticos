-- Contador de visitas del sitio público (una por sesión de navegador).
-- Solo el service role inserta vía API; el panel admin lee el total.

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
