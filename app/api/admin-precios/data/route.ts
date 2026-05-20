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
    const [modo, payload] = await Promise.all([
      getModoCapturaPrecios(supabase),
      fetchAdminPreciosPayload(supabase),
    ]);
    return Response.json({ ok: true, modo, ...payload });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
