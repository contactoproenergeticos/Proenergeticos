-- Modo de captura de precios: automatico (cron CRE) | manual (panel admin-precios).

insert into public.configuraciones_globales (clave, valor_texto)
values ('precios_modo_captura', 'automatico')
on conflict (clave) do nothing;
