import type { SupabaseClient } from '@supabase/supabase-js';

export const CLAVE_MODO_PRECIOS = 'precios_modo_captura';
export type ModoCapturaPrecios = 'automatico' | 'manual';

export function normalizeModoCaptura(val: unknown): ModoCapturaPrecios {
  const v = String(val ?? '').trim().toLowerCase();
  return v === 'manual' ? 'manual' : 'automatico';
}

export async function getModoCapturaPrecios(
  supabase: SupabaseClient
): Promise<ModoCapturaPrecios> {
  const { data, error } = await supabase
    .from('configuraciones_globales')
    .select('valor_texto')
    .eq('clave', CLAVE_MODO_PRECIOS)
    .maybeSingle();

  if (error || !data) return 'automatico';
  return normalizeModoCaptura(data.valor_texto);
}

export async function setModoCapturaPrecios(
  supabase: SupabaseClient,
  modo: ModoCapturaPrecios
): Promise<{ ok: boolean; error?: string }> {
  const valor_texto = normalizeModoCaptura(modo);
  const { error } = await supabase.from('configuraciones_globales').upsert(
    {
      clave: CLAVE_MODO_PRECIOS,
      valor_texto,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'clave' }
  );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function isCapturaManualActiva(supabase: SupabaseClient): Promise<boolean> {
  return (await getModoCapturaPrecios(supabase)) === 'manual';
}
