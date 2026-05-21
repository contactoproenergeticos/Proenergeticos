import {
  isPublicVisitPath,
  normalizeVisitSessionKey,
  registerPublicVisit,
} from '@/lib/visitasSitio';
import { getServiceSupabase } from '@/lib/supabaseService';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: { sessionKey?: string; path?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'Cuerpo inválido.' }, { status: 400 });
  }

  const path = body.path ?? '/';
  if (!isPublicVisitPath(path)) {
    return Response.json({ ok: true, skipped: true, reason: 'ruta_no_publica' });
  }

  const sessionKey = normalizeVisitSessionKey(body.sessionKey);
  if (!sessionKey) {
    return Response.json({ ok: false, error: 'Sesión inválida.' }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return Response.json({ ok: false, error: 'Supabase no configurado.' }, { status: 503 });
  }

  try {
    const result = await registerPublicVisit(supabase, sessionKey, path);
    return Response.json({ ok: true, ...result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
