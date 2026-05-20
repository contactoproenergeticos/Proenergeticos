import type { PostgrestError } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

export const CLAVE_MODO_PRECIOS = 'precios_modo_captura';
export type ModoCapturaPrecios = 'automatico' | 'manual';

export type ModoCapturaResult = {
  modo: ModoCapturaPrecios;
  /** La tabla configuraciones_globales no existe en este proyecto Supabase. */
  tablaConfigFaltante: boolean;
};

export function normalizeModoCaptura(val: unknown): ModoCapturaPrecios {
  const v = String(val ?? '').trim().toLowerCase();
  return v === 'manual' ? 'manual' : 'automatico';
}

export function isConfiguracionesTableMissing(error: PostgrestError | null | undefined): boolean {
  if (!error) return false;
  const msg = `${error.message ?? ''} ${error.details ?? ''}`.toLowerCase();
  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    msg.includes('configuraciones_globales') ||
    msg.includes('schema cache')
  );
}

export const AVISO_TABLA_CONFIG_FALTANTE =
  'Falta la tabla configuraciones_globales en Supabase. Ejecuta el SQL en supabase/setup-admin-precios.sql (SQL Editor) y recarga esta página.';

export async function getModoCapturaPrecios(
  supabase: SupabaseClient
): Promise<ModoCapturaResult> {
  const { data, error } = await supabase
    .from('configuraciones_globales')
    .select('valor_texto')
    .eq('clave', CLAVE_MODO_PRECIOS)
    .maybeSingle();

  if (isConfiguracionesTableMissing(error)) {
    return { modo: 'automatico', tablaConfigFaltante: true };
  }

  if (error || !data) {
    return { modo: 'automatico', tablaConfigFaltante: false };
  }

  return {
    modo: normalizeModoCaptura(data.valor_texto),
    tablaConfigFaltante: false,
  };
}

export async function setModoCapturaPrecios(
  supabase: SupabaseClient,
  modo: ModoCapturaPrecios
): Promise<{ ok: boolean; error?: string; tablaConfigFaltante?: boolean }> {
  const valor_texto = normalizeModoCaptura(modo);
  const { error } = await supabase.from('configuraciones_globales').upsert(
    {
      clave: CLAVE_MODO_PRECIOS,
      valor_texto,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'clave' }
  );

  if (isConfiguracionesTableMissing(error)) {
    return { ok: false, error: AVISO_TABLA_CONFIG_FALTANTE, tablaConfigFaltante: true };
  }

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function isCapturaManualActiva(supabase: SupabaseClient): Promise<boolean> {
  const { modo, tablaConfigFaltante } = await getModoCapturaPrecios(supabase);
  if (tablaConfigFaltante) return false;
  return modo === 'manual';
}
