import { unauthorizedPreciosResponse, verifyAdminPreciosPin } from '@/lib/adminPreciosAuth';
import { parsePrecioInput, validatePrecioInput } from '@/lib/adminPreciosValidation';
import { leyendasVigenciaAhora } from '@/lib/preciosLeyenda';
import { getModoCapturaPrecios } from '@/lib/preciosModoCaptura';
import { getServiceSupabase } from '@/lib/supabaseService';

export const dynamic = 'force-dynamic';

type UpdateItem = { id: string; precio: string | number };

export async function POST(req: Request) {
  let body: { pin?: string; updates?: UpdateItem[] };
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

  const modo = await getModoCapturaPrecios(supabase);
  if (modo !== 'manual') {
    return Response.json(
      {
        ok: false,
        error: 'Activa Modo Manual para editar precios desde este panel.',
      },
      { status: 400 }
    );
  }

  const updates = body.updates;
  if (!Array.isArray(updates) || updates.length === 0) {
    return Response.json({ ok: false, error: 'No hay precios para guardar.' }, { status: 400 });
  }

  const leyendas = leyendasVigenciaAhora();
  const now = new Date().toISOString();
  const errores: Record<string, string> = {};

  for (const item of updates) {
    const id = String(item.id ?? '').trim();
    if (!id) continue;

    const raw =
      typeof item.precio === 'number' ? String(item.precio) : String(item.precio ?? '').trim();
    const validation = validatePrecioInput(raw);
    if (validation) {
      errores[id] = validation;
      continue;
    }

    const precio = parsePrecioInput(raw);
    if (precio == null) {
      errores[id] = 'Precio inválido';
      continue;
    }

    const { error } = await supabase
      .from('precios_combustible')
      .update({
        precio,
        fecha_actualizacion: leyendas.fecha_actualizacion,
        hora_actualizacion: leyendas.hora_actualizacion,
        updated_at: now,
      })
      .eq('id', id);

    if (error) errores[id] = error.message;
  }

  if (Object.keys(errores).length > 0) {
    return Response.json(
      {
        ok: false,
        error: 'Algunos precios no se pudieron guardar.',
        errores,
        leyendas,
      },
      { status: 422 }
    );
  }

  return Response.json({
    ok: true,
    mensaje: 'Precios actualizados',
    leyendas,
  });
}
