import { unauthorizedPreciosResponse, verifyAdminPreciosPin } from '@/lib/adminPreciosAuth';
import { updatePrecioCombustibleRow } from '@/lib/adminPreciosUpdate';
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
      {
        ok: false,
        error:
          'Falta SUPABASE_SERVICE_ROLE_KEY en .env.local (o en Vercel). Sin ella el panel no puede escribir en la base de datos.',
      },
      { status: 500 }
    );
  }

  const { modo } = await getModoCapturaPrecios(supabase);
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
  let actualizados = 0;
  let omitidos = 0;

  for (const item of updates) {
    const id = String(item.id ?? '').trim();
    if (!id) {
      omitidos += 1;
      continue;
    }

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

    const result = await updatePrecioCombustibleRow(supabase, id, {
      precio,
      updated_at: now,
      fecha_actualizacion: leyendas.fecha_actualizacion,
      hora_actualizacion: leyendas.hora_actualizacion,
    });

    if (!result.ok) {
      errores[id] = result.error ?? 'Error desconocido';
      continue;
    }
    actualizados += 1;
  }

  if (actualizados === 0) {
    return Response.json(
      {
        ok: false,
        error:
          omitidos > 0 && Object.keys(errores).length === 0
            ? 'Ningún registro tenía ID válido. Recarga el panel e intenta de nuevo.'
            : 'Ningún precio se guardó en Supabase.',
        errores,
        actualizados: 0,
      },
      { status: 422 }
    );
  }

  if (Object.keys(errores).length > 0) {
    return Response.json(
      {
        ok: false,
        error: `Se guardaron ${actualizados} precio(s), pero otros fallaron.`,
        errores,
        actualizados,
        leyendas,
      },
      { status: 422 }
    );
  }

  return Response.json({
    ok: true,
    mensaje: 'Precios actualizados',
    actualizados,
    leyendas,
  });
}
