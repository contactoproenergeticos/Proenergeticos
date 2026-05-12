import { NextResponse } from 'next/server';
import { runSyncPreciosCombustible } from '@/lib/syncPreciosCombustible';

export const dynamic = 'force-dynamic';

/** Scraping + varias filas Supabase: margen para cold start y red. */
export const maxDuration = 120;

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 8) {
    return false;
  }
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${secret}`;
}

/**
 * GET protegido: Authorization: Bearer <CRON_SECRET> (Vercel Cron lo envía si CRON_SECRET está en el proyecto).
 * Misma lógica que `npm run sync:precios` → `lib/syncPreciosCombustible.ts`.
 */
export async function GET(req: Request) {
  const inicio = new Date().toISOString();

  if (!isAuthorized(req)) {
    return NextResponse.json(
      {
        ok: false,
        inicio,
        error:
          'No autorizado. Configura CRON_SECRET en Vercel y usa Authorization: Bearer <CRON_SECRET> (el Cron de Vercel lo inyecta automáticamente).',
      },
      { status: 401 }
    );
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json(
      {
        ok: false,
        inicio,
        error: 'Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno del deploy.',
      },
      { status: 500 }
    );
  }

  try {
    const result = await runSyncPreciosCombustible();
    const fin = new Date().toISOString();

    const { ok, ...rest } = result;

    return NextResponse.json(
      {
        ok,
        inicio,
        fin,
        mensaje: ok
          ? 'Precios sincronizados desde gasolinamexico.com.mx hacia Supabase.'
          : rest.error ?? 'Sincronización con advertencias o errores.',
        ...rest,
      },
      { status: ok ? 200 : 500 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[cron/sync-precios]', e);
    return NextResponse.json(
      {
        ok: false,
        inicio,
        fin: new Date().toISOString(),
        error: msg,
      },
      { status: 500 }
    );
  }
}
