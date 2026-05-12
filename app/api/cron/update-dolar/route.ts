import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const FRANKFURTER_URL = 'https://api.frankfurter.app/latest?from=USD&to=MXN';

type FrankfurterLatest = {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
};

export async function GET() {
  const inicio = new Date().toISOString();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      {
        ok: false,
        inicio,
        error: 'Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.',
        valorObtenidoInternet: null,
        frankfurter: null,
        supabase: { exito: false, error: 'Variables de entorno incompletas', detalle: null },
      },
      { status: 500 }
    );
  }

  let valorInternet: number | null = null;
  let frankfurterMeta: {
    fechaTipoCambio: string;
    monedaBase: string;
    monedaDestino: string;
    endpoint: string;
  } | null = null;

  try {
    const fxRes = await fetch(FRANKFURTER_URL, { cache: 'no-store' });
    if (!fxRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          inicio,
          error: `Frankfurter respondió HTTP ${fxRes.status}`,
          valorObtenidoInternet: null,
          frankfurter: { endpoint: FRANKFURTER_URL, httpStatus: fxRes.status },
          supabase: { exito: false, error: 'No se consultó Supabase: falló Frankfurter.', detalle: null },
        },
        { status: 502 }
      );
    }

    const fxJson = (await fxRes.json()) as FrankfurterLatest;
    const raw = fxJson.rates?.MXN;
    const mxn = typeof raw === 'number' ? raw : Number(raw);

    if (!Number.isFinite(mxn) || mxn <= 0) {
      return NextResponse.json(
        {
          ok: false,
          inicio,
          error: 'Frankfurter no devolvió una tasa MXN válida en rates.MXN',
          valorObtenidoInternet: null,
          frankfurter: {
            endpoint: FRANKFURTER_URL,
            fechaTipoCambio: fxJson.date ?? null,
            cuerpoParcial: fxJson,
          },
          supabase: { exito: false, error: 'No se escribió en Supabase: dato inválido.', detalle: null },
        },
        { status: 502 }
      );
    }

    valorInternet = mxn;
    frankfurterMeta = {
      fechaTipoCambio: fxJson.date,
      monedaBase: fxJson.base,
      monedaDestino: 'MXN',
      endpoint: FRANKFURTER_URL,
    };

    const supabase = createClient(supabaseUrl, serviceKey);
    const updatedAt = new Date().toISOString();
    const { error: supabaseError } = await supabase.from('tipo_cambio').upsert(
      { id: 1, valor: mxn, updated_at: updatedAt },
      { onConflict: 'id' }
    );

    if (supabaseError) {
      console.error('[cron/update-dolar] Supabase:', supabaseError.message, supabaseError);
      return NextResponse.json(
        {
          ok: false,
          inicio,
          fin: new Date().toISOString(),
          error: supabaseError.message,
          valorObtenidoInternet: mxn,
          valorFormateado: mxn.toFixed(4),
          frankfurter: frankfurterMeta,
          supabase: {
            exito: false,
            error: supabaseError.message,
            detalle: {
              code: supabaseError.code,
              details: supabaseError.details,
              hint: supabaseError.hint,
            },
            tabla: 'tipo_cambio',
            id: 1,
          },
        },
        { status: 500 }
      );
    }

    console.log(`Robot ejecutado: nuevo valor [${mxn}]`);

    return NextResponse.json({
      ok: true,
      inicio,
      fin: new Date().toISOString(),
      mensaje: 'Tipo de cambio actualizado desde Frankfurter y guardado en Supabase.',
      valorObtenidoInternet: mxn,
      valorFormateado: mxn.toFixed(4),
      frankfurter: frankfurterMeta,
      supabase: {
        exito: true,
        error: null,
        detalle: null,
        tabla: 'tipo_cambio',
        id: 1,
        updated_at: updatedAt,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[cron/update-dolar]', e);
    return NextResponse.json(
      {
        ok: false,
        inicio,
        fin: new Date().toISOString(),
        error: msg,
        valorObtenidoInternet: valorInternet,
        frankfurter: frankfurterMeta,
        supabase: { exito: false, error: msg, detalle: null },
      },
      { status: 500 }
    );
  }
}
