-- Tabla de enlaces a portales de facturación por estación de servicio.
-- Una sola fila con una columna por estación; los identificadores se
-- conservan en mayúsculas (GSI, GPO) tal como ya existe en producción.

create table if not exists public.facturacion (
  id bigint primary key generated always as identity,
  "GSI" text,
  "GPO" text
);

alter table public.facturacion enable row level security;

drop policy if exists "facturacion_select_anon" on public.facturacion;
create policy "facturacion_select_anon" on public.facturacion
  for select using (true);

-- Semilla mínima: asegura una única fila editable desde el panel de Supabase.
insert into public.facturacion (id, "GSI", "GPO")
select 1, 'www.igasfac.com.mx', 'https://factura.enerfueltech.com/'
where not exists (select 1 from public.facturacion);
