import { unauthorizedPreciosResponse, verifyAdminPreciosPin } from '@/lib/adminPreciosAuth';
import {
  normalizeModoCaptura,
  setModoCapturaPrecios,
  type ModoCapturaPrecios,
} from '@/lib/preciosModoCaptura';
import { getServiceSupabase } from '@/lib/supabaseService';
import { runSyncPreciosCombustible } from '@/lib/syncPreciosCombustible';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function POST(req: Request) {
  let body: { pin?: string; modo?: string; sincronizar?: boolean };
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

  const modo: ModoCapturaPrecios = normalizeModoCaptura(body.modo);
  const saved = await setModoCapturaPrecios(supabase, modo);
  if (!saved.ok) {
    return Response.json({ ok: false, error: saved.error }, { status: 500 });
  }

  let sync: Awaited<ReturnType<typeof runSyncPreciosCombustible>> | undefined;
  if (modo === 'automatico' && body.sincronizar !== false) {
    sync = await runSyncPreciosCombustible();
  }

  return Response.json({ ok: true, modo, sync });
}
