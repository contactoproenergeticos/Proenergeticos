import { unauthorizedPreciosResponse, verifyAdminPreciosPin } from '@/lib/adminPreciosAuth';
import { fetchAdminPreciosPayload } from '@/lib/adminPreciosData';
import { getModoCapturaPrecios } from '@/lib/preciosModoCaptura';
import { getServiceSupabase } from '@/lib/supabaseService';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: { pin?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'Cuerpo inválido.' }, { status: 400 });
  }

  if (!verifyAdminPreciosPin(body.pin)) return unauthorizedPreciosResponse();

  const supabase = getServiceSupabase();
  if (!supabase) {
    return Response.json(
      { ok: false, error: 'Servidor sin SUPABASE_SERVICE_ROLE_KEY configurada.' },
      { status: 500 }
    );
  }

  try {
    const [modoResult, payload] = await Promise.all([
      getModoCapturaPrecios(supabase),
      fetchAdminPreciosPayload(supabase),
    ]);
    return Response.json({
      ok: true,
      modo: modoResult.modo,
      tablaConfigFaltante: modoResult.tablaConfigFaltante,
      aviso: modoResult.tablaConfigFaltante
        ? 'Ejecuta supabase/setup-admin-precios.sql en el SQL Editor de Supabase para activar el cambio de modo automático/manual.'
        : null,
      ...payload,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
