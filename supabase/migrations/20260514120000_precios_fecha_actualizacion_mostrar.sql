-- (Opcional / legado) La app ya no usa esta clave para /precios: la vigencia sale de
-- precios_combustible.updated_at. Puedes borrar la fila o ignorarla.

insert into public.configuraciones_globales (clave, valor_texto)
values ('precios_fecha_actualizacion_mostrar', null)
on conflict (clave) do nothing;
