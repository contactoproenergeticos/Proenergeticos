import { verifyAdminPreciosPin } from '@/lib/adminPreciosAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: { pin?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'Cuerpo inválido.' }, { status: 400 });
  }

  if (!verifyAdminPreciosPin(body.pin)) {
    return Response.json({ ok: false, error: 'PIN incorrecto.' }, { status: 401 });
  }

  return Response.json({ ok: true });
}
