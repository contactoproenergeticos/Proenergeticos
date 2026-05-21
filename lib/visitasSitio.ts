import type { SupabaseClient } from '@supabase/supabase-js';

export const VISITAS_TABLE = 'visitas_sitio';

export function isPublicVisitPath(path: unknown): path is string {
  if (typeof path !== 'string' || !path.startsWith('/')) return false;
  if (path.startsWith('/admin-precios')) return false;
  if (path.startsWith('/api/')) return false;
  return true;
}

export function normalizeVisitSessionKey(raw: unknown): string | null {
  const key = String(raw ?? '').trim();
  if (key.length < 8 || key.length > 128) return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(key)) return null;
  return key;
}

/** Registra una visita única por session_key (ignora duplicados). */
export async function registerPublicVisit(
  supabase: SupabaseClient,
  sessionKey: string,
  path: string
): Promise<{ recorded: boolean; duplicate?: boolean }> {
  const { error } = await supabase.from(VISITAS_TABLE).insert({
    session_key: sessionKey,
    path,
  });

  if (error) {
    if (error.code === '23505') return { recorded: false, duplicate: true };
    if (error.code === '42P01') {
      throw new Error('Falta la tabla visitas_sitio en Supabase. Ejecuta la migración de visitas.');
    }
    throw error;
  }

  return { recorded: true };
}

/** Total de visitas registradas (sesiones únicas). */
export async function getTotalVisitas(supabase: SupabaseClient): Promise<number> {
  const { count, error } = await supabase
    .from(VISITAS_TABLE)
    .select('*', { count: 'exact', head: true });

  if (error) {
    if (error.code === '42P01') return 0;
    throw error;
  }

  return count ?? 0;
}
