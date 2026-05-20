import type { SupabaseClient } from '@supabase/supabase-js';
import { fuelKindFromParts } from './fuelLabelKind';

export type AdminPrecioRow = {
  id: string;
  estacion_id: string;
  label: string;
  subtitulo: string | null;
  precio: number | null;
  fecha_actualizacion: string | null;
  hora_actualizacion: string | null;
};

export type AdminEstacionGroup = {
  id: string;
  nombre: string;
  marca: string | null;
  orden: number;
  precios: AdminPrecioRow[];
};

function sortPreciosAdmin(rows: AdminPrecioRow[]): AdminPrecioRow[] {
  const rank = (label: string, subtitulo: string | null) => {
    const k = fuelKindFromParts(label, subtitulo);
    if (k === 'magna') return 0;
    if (k === 'premium') return 1;
    if (k === 'diesel') return 2;
    return 50;
  };
  return [...rows].sort((a, b) => rank(a.label, b.subtitulo) - rank(b.label, b.subtitulo));
}

export async function fetchAdminPreciosPayload(
  supabase: SupabaseClient
): Promise<{ estaciones: AdminEstacionGroup[] }> {
  const { data: estacionesMeta, error: errEst } = await supabase
    .from('estaciones')
    .select('id,nombre,marca,orden')
    .order('orden', { ascending: true });

  if (errEst || !estacionesMeta?.length) {
    throw new Error(errEst?.message ?? 'No hay estaciones registradas.');
  }

  const ids = estacionesMeta.map((e) => e.id);
  const { data: precRows, error: errPrec } = await supabase
    .from('precios_combustible')
    .select('id,estacion_id,label,subtitulo,precio,fecha_actualizacion,hora_actualizacion')
    .in('estacion_id', ids);

  if (errPrec) throw new Error(errPrec.message);

  const porEstacion = new Map<string, AdminPrecioRow[]>();
  for (const row of precRows ?? []) {
    const estacionId = String(row.estacion_id);
    const list = porEstacion.get(estacionId) ?? [];
    list.push({
      id: String(row.id),
      estacion_id: estacionId,
      label: String(row.label ?? ''),
      subtitulo: row.subtitulo != null ? String(row.subtitulo) : null,
      precio: row.precio != null ? Number(row.precio) : null,
      fecha_actualizacion:
        row.fecha_actualizacion != null ? String(row.fecha_actualizacion) : null,
      hora_actualizacion:
        row.hora_actualizacion != null ? String(row.hora_actualizacion) : null,
    });
    porEstacion.set(estacionId, list);
  }

  const estaciones: AdminEstacionGroup[] = estacionesMeta.map((est) => ({
    id: String(est.id),
    nombre: String(est.nombre),
    marca: est.marca != null ? String(est.marca) : null,
    orden: Number(est.orden) || 0,
    precios: sortPreciosAdmin(porEstacion.get(String(est.id)) ?? []),
  }));

  return { estaciones };
}
