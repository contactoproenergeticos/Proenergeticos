import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

function isMissingColumnError(error: PostgrestError): boolean {
  const msg = `${error.message ?? ''} ${error.details ?? ''}`.toLowerCase();
  return (
    error.code === 'PGRST204' ||
    msg.includes('column') ||
    msg.includes('fecha_actualizacion') ||
    msg.includes('hora_actualizacion')
  );
}

export type UpdatePrecioPayload = {
  precio: number;
  updated_at: string;
  fecha_actualizacion?: string;
  hora_actualizacion?: string;
};

/**
 * Actualiza una fila de precios_combustible. Si las columnas de leyenda no existen,
 * reintenta solo con precio + updated_at.
 */
export async function updatePrecioCombustibleRow(
  supabase: SupabaseClient,
  id: string,
  payload: UpdatePrecioPayload
): Promise<{ ok: boolean; error?: string }> {
  const full = {
    precio: payload.precio,
    updated_at: payload.updated_at,
    fecha_actualizacion: payload.fecha_actualizacion,
    hora_actualizacion: payload.hora_actualizacion,
  };

  let { data, error } = await supabase
    .from('precios_combustible')
    .update(full)
    .eq('id', id)
    .select('id');

  if (error && isMissingColumnError(error)) {
    ({ data, error } = await supabase
      .from('precios_combustible')
      .update({
        precio: payload.precio,
        updated_at: payload.updated_at,
      })
      .eq('id', id)
      .select('id'));
  }

  if (error) return { ok: false, error: error.message };
  if (!data?.length) {
    return { ok: false, error: 'No se encontró el registro (id incorrecto o sin permisos de escritura).' };
  }
  return { ok: true };
}
