-- Tipo de cambio USD/MXN: una sola fila (id = 1). La app admin escribe aquí.
create table if not exists public.tipo_cambio (
  id integer primary key,
  valor numeric not null,
  updated_at timestamptz not null default now()
);

insert into public.tipo_cambio (id, valor) values (1, 17.79)
on conflict (id) do nothing;

alter table public.tipo_cambio enable row level security;

drop policy if exists "tipo_cambio_select_anon" on public.tipo_cambio;
create policy "tipo_cambio_select_anon" on public.tipo_cambio
  for select using (true);

drop policy if exists "tipo_cambio_update_anon" on public.tipo_cambio;
create policy "tipo_cambio_update_anon" on public.tipo_cambio
  for update using (id = 1) with check (id = 1);

drop policy if exists "tipo_cambio_insert_anon" on public.tipo_cambio;
create policy "tipo_cambio_insert_anon" on public.tipo_cambio
  for insert with check (id = 1);
