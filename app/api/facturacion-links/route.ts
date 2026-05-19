import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { enlacesDesdeFilaFacturacion } from '@/lib/facturacionUrls';

export const dynamic = 'force-dynamic';

/**
 * Lectura en servidor: prioriza `SUPABASE_SERVICE_ROLE_KEY` para que los enlaces
 * sigan funcionando aunque en `facturacion` no exista (aún) una política RLS de
 * SELECT para el rol anónimo. Si no hay service role, usa la anon key.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    return NextResponse.json(
      { ok: false, error: 'Falta NEXT_PUBLIC_SUPABASE_URL.' },
      { status: 500 }
    );
  }

  const key = serviceKey || anonKey;
  if (!key) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Falta SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_ANON_KEY para leer la tabla facturacion.',
      },
      { status: 500 }
    );
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.from('facturacion').select('*').limit(1);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 502 });
  }

  const fila = (data?.[0] ?? {}) as Record<string, unknown>;
  const links = enlacesDesdeFilaFacturacion(fila);

  return NextResponse.json(
    { ok: true, ...links },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  );
}
