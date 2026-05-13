/**
 * Sincroniza precios desde gasolinamexico.com.mx hacia Supabase.
 * Misma lógica que el script histórico `scripts/sync-precios-combustible.mjs` (ahora este módulo es la fuente única).
 *
 * Requiere: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import ws from 'ws';
import { fuelKindFromParts } from './fuelLabelKind';

const LIST_URL = 'https://www.gasolinamexico.com.mx/estados/sinaloa/mazatlan/';

/**
 * Leyendas de vigencia: en GitHub Actions las calcula `scripts/sync-precios-combustible.mjs`
 * y las pasa por `PREC_SYNC_*`. Si faltan (p. ej. cron en Vercel), se recalculan aquí con
 * la misma convención que el `.mjs`.
 */
const TZ_LEYENDA = 'America/Mazatlan';

function leyendaFechaMazatlanLocal(instant: Date): string {
  const weekday = new Intl.DateTimeFormat('es-MX', { timeZone: TZ_LEYENDA, weekday: 'long' }).format(
    instant
  );
  const day = new Intl.DateTimeFormat('es-MX', { timeZone: TZ_LEYENDA, day: 'numeric' }).format(instant);
  const month = new Intl.DateTimeFormat('es-MX', { timeZone: TZ_LEYENDA, month: 'long' }).format(instant);
  return `${weekday.toLowerCase()}, ${day} de ${month}`;
}

function leyendaHoraMazatlanLocal(instant: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ_LEYENDA,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(instant);
}

const PERMISO_POR_ESTACION: { test: (n: string) => boolean; permiso: string }[] = [
  { test: (n) => /santa\s*irene|gsi/i.test(n), permiso: 'PL/2840/EXP/ES/2015' },
  { test: (n) => /pozole|rusher|gpo/i.test(n), permiso: 'PL/23676/EXP/ES/2020' },
];

type CombustibleKind = keyof FuelSnap;

/** El Pozole en producción: Diésel Industrial siempre este `precios_combustible.id`. */
const ESTACION_EL_POZOLE_ID = 'bab496ad-333e-400b-9304-469b6f849c6d';
const PRECIO_DIESEL_INDUSTRIAL_EL_POZOLE_ID = '7490c2a8-f98f-4e93-802c-43380f0499ef';

function normalizeUuid(u: string): string {
  return String(u).replace(/-/g, '').toLowerCase();
}

/**
 * UUID fijos en `precios_combustible` (coinciden con la base en producción).
 * El `.update(...).eq('id', ...)` usa estos valores cuando el permiso CRE coincide.
 */
const PRECIO_ROW_ID_POR_PERMISO_Y_COMBUSTIBLE: Partial<
  Record<string, Partial<Record<CombustibleKind, string>>>
> = {
  'PL/2840/EXP/ES/2015': {
    /** Diésel (UBA) */
    diesel: '326414ab-4aa1-4a64-925e-c21605935ebc',
  },
  'PL/23676/EXP/ES/2020': {
    /** Gasolina Magna */
    magna: '65bcad2e-d19a-4692-9a71-fec1819e8882',
    /** Gasolina Premium */
    premium: 'b37a9c2c-af8d-4e40-a826-2423731907b9',
    /** Diésel (Industrial) — mismo UUID que `ESTACION_EL_POZOLE_ID` + diesel forzado */
    diesel: '7490c2a8-f98f-4e93-802c-43380f0499ef',
  },
};

const FETCH_HEADERS: Record<string, string> = {
  Accept: 'text/html,application/xhtml+xml',
  'Accept-Language': 'es-MX,es;q=0.9',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
};

type FuelSnap = { magna: string | null; premium: string | null; diesel: string | null };

type EstacionRow = {
  id: string;
  nombre: string;
  orden: number;
  permiso_cre: string | null;
};

type PrecioRow = {
  id: string;
  label: string | null;
  subtitulo: string | null;
  precio: number | string | null;
};

export type SyncPreciosUpdate = {
  estacion: string;
  label: string;
  from: string;
  to: string;
};

export type SyncPreciosResult = {
  ok: boolean;
  error?: string;
  estacionesLeidas?: number;
  permisos?: string[];
  updates?: SyncPreciosUpdate[];
  warnings?: string[];
  durationMs?: number;
};

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function absolutizeWww(url: string): string {
  return url.replace(
    /^https:\/\/gasolinamexico\.com\.mx\//,
    'https://www.gasolinamexico.com.mx/'
  );
}

function collectStationLinks(html: string): string[] {
  const set = new Set<string>();
  const re = /href="(https:\/\/[^"]*\/estacion\/[^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    set.add(absolutizeWww(m[1]));
  }
  return [...set];
}

function extractPermiso(html: string): string | null {
  const match = html.match(/<strong>Permiso:<\/strong>\s*([^<]+)/i);
  return match ? match[1].trim().replace(/\s+/g, '') : null;
}

function extractCardPrice(html: string, cardClass: string): string | null {
  const re = new RegExp(`<div class="card ${cardClass}"[\\s\\S]*?<p>([^<]*)<\\/p>`, 'i');
  const m = html.match(re);
  if (!m) return null;
  return m[1].trim();
}

/** Variantes de clase en gasolinamexico.com.mx para la tarjeta de diesel. */
const DIESEL_CARD_CLASSES = [
  'diesel',
  'diesel-uba',
  'diesel_uba',
  'diesel-industrial',
  'dieselindustrial',
  'diésel',
];

function extractDieselPrice(html: string): string | null {
  for (const cls of DIESEL_CARD_CLASSES) {
    const v = parsePriceFromSource(extractCardPrice(html, cls));
    if (v) return v;
  }
  const re = /<div class="([^"]*\bdiesel[^"]*)"[\s\S]*?<p>([^<]*)<\/p>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const v = parsePriceFromSource(m[2]?.trim() ?? null);
    if (v) return v;
  }
  return null;
}

function parsePriceFromSource(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const t = String(raw).trim();
  if (!t || t === '?' || t === '—' || t === '-' || /^n\/?d$/i.test(t)) return null;
  const withNum = t.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (!withNum) return null;
  const n = Number(withNum[1]);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n.toFixed(2);
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

async function scrapeByPermisos(permisos: string[]): Promise<Record<string, FuelSnap>> {
  const listHtml = await fetchText(LIST_URL);
  const links = collectStationLinks(listHtml);
  const pending = new Set(permisos);
  const out: Record<string, FuelSnap> = {};

  for (const url of links) {
    if (pending.size === 0) break;
    const html = await fetchText(url);
    const perm = extractPermiso(html);
    if (!perm || !pending.has(perm)) {
      await sleep(75);
      continue;
    }

    out[perm] = {
      magna: parsePriceFromSource(extractCardPrice(html, 'magna')),
      premium: parsePriceFromSource(extractCardPrice(html, 'premium')),
      diesel: extractDieselPrice(html),
    };
    pending.delete(perm);
    await sleep(75);
  }

  for (const p of pending) {
    console.warn(`[sync-precios] No se encontró estación para permiso ${p}`);
    out[p] = { magna: null, premium: null, diesel: null };
  }
  return out;
}

function permisoDesdeNombre(nombre: string): string | null {
  const n = String(nombre || '');
  for (const { test, permiso } of PERMISO_POR_ESTACION) {
    if (test(n)) return permiso;
  }
  return null;
}

function formatPrecioDb(val: number | string | null | undefined): string | null {
  if (val == null) return null;
  const n = typeof val === 'number' ? val : Number(String(val).replace(',', '.'));
  if (!Number.isFinite(n)) return null;
  return n.toFixed(2);
}

function precioRowIdParaActualizar(
  estacionId: string,
  permiso: string,
  kind: CombustibleKind,
  precRows: PrecioRow[]
): string | null {
  if (kind === 'diesel' && normalizeUuid(estacionId) === normalizeUuid(ESTACION_EL_POZOLE_ID)) {
    return PRECIO_DIESEL_INDUSTRIAL_EL_POZOLE_ID;
  }

  const fijo = PRECIO_ROW_ID_POR_PERMISO_Y_COMBUSTIBLE[permiso]?.[kind];
  if (fijo) {
    const ok = precRows.some((r) => r.id === fijo);
    if (!ok) {
      return null;
    }
    return fijo;
  }
  const row = precRows.find((r) => fuelKindFromParts(r.label, r.subtitulo) === kind);
  if (!row?.id) return null;
  return row.id;
}

/**
 * Ejecuta scraping + actualización en Supabase (service role).
 */
export async function runSyncPreciosCombustible(): Promise<SyncPreciosResult> {
  const t0 = Date.now();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return {
      ok: false,
      error: 'Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.',
      durationMs: Date.now() - t0,
    };
  }

  // Node < 22 no expone WebSocket global; @supabase/realtime-js lo necesita aunque no usemos canales.
  const supabase: SupabaseClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    ...(typeof globalThis.WebSocket === 'undefined'
      ? { realtime: { transport: ws as never } }
      : {}),
  });

  const { data: estaciones, error: e1 } = await supabase
    .from('estaciones')
    .select('id,nombre,orden,permiso_cre')
    .order('orden', { ascending: true });

  if (e1) {
    return {
      ok: false,
      error: `Error leyendo estaciones: ${e1.message}`,
      durationMs: Date.now() - t0,
    };
  }
  if (!estaciones?.length) {
    return { ok: false, error: 'No hay filas en estaciones.', durationMs: Date.now() - t0 };
  }

  const rows = estaciones as EstacionRow[];

  function permisoParaEstacion(est: EstacionRow): string | null {
    const desdeTabla = est.permiso_cre && String(est.permiso_cre).trim();
    if (desdeTabla) return desdeTabla;
    return permisoDesdeNombre(est.nombre);
  }

  const permisos = [...new Set(rows.map(permisoParaEstacion).filter(Boolean))] as string[];
  if (!permisos.length) {
    return {
      ok: false,
      error:
        'Ninguna estación tiene permiso_cre en la base ni coincide con PERMISO_POR_ESTACION por nombre.',
      durationMs: Date.now() - t0,
    };
  }

  let scraped: Record<string, FuelSnap>;
  try {
    scraped = await scrapeByPermisos(permisos);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Scraping falló: ${msg}`, durationMs: Date.now() - t0 };
  }

  const now = new Date().toISOString();
  const instantLeyenda = new Date();
  const fecha_actualizacion =
    process.env.PREC_SYNC_FECHA_ACTUALIZACION?.trim() || leyendaFechaMazatlanLocal(instantLeyenda);
  const hora_actualizacion =
    process.env.PREC_SYNC_HORA_ACTUALIZACION?.trim() || leyendaHoraMazatlanLocal(instantLeyenda);

  if (process.env.GITHUB_ACTIONS === 'true') {
    console.log(
      '[sync-precios] Leyenda (fecha_actualizacion / hora_actualizacion):',
      JSON.stringify({ fecha_actualizacion, hora_actualizacion })
    );
  }
  let hadError = false;
  const updates: SyncPreciosUpdate[] = [];
  const warnings: string[] = [];

  for (const est of rows) {
    const perm = permisoParaEstacion(est);
    if (!perm) {
      warnings.push(`[${est.nombre}] Sin permiso CRE (columna o nombre); se omite.`);
      continue;
    }
    const snap = scraped[perm];
    if (!snap) continue;

    const { data: precRows, error: e2 } = await supabase
      .from('precios_combustible')
      .select('id,label,subtitulo,precio')
      .eq('estacion_id', est.id);

    if (e2) {
      console.error(`[${est.nombre}] Error leyendo precios:`, e2.message);
      hadError = true;
      warnings.push(`[${est.nombre}] Error leyendo precios: ${e2.message}`);
      continue;
    }

    if (!precRows?.length) {
      warnings.push(`[${est.nombre}] Sin filas en precios_combustible; inserta filas o aplica migración.`);
      continue;
    }

    const lista = precRows as PrecioRow[];
    const kinds: CombustibleKind[] = ['magna', 'premium', 'diesel'];

    for (const kind of kinds) {
      const resolved = precioRowIdParaActualizar(est.id, perm, kind, lista);
      if (!resolved) {
        const fijo = PRECIO_ROW_ID_POR_PERMISO_Y_COMBUSTIBLE[perm]?.[kind];
        if (fijo) {
          warnings.push(
            `[${est.nombre}] ID fijo ${kind} (${fijo}) no está en precios_combustible de esta estación; revisa estacion_id en Supabase.`
          );
        }
        continue;
      }

      const nuevo = snap[kind];
      if (nuevo == null) continue;

      let row = lista.find((r) => r.id === resolved);
      let actual = formatPrecioDb(row?.precio ?? null);
      if (!row) {
        const { data: precioSolo, error: ePrecio } = await supabase
          .from('precios_combustible')
          .select('precio,label,subtitulo')
          .eq('id', resolved)
          .maybeSingle();
        if (ePrecio) {
          warnings.push(`[${est.nombre}] No se pudo leer precio por id ${resolved}: ${ePrecio.message}`);
          continue;
        }
        if (precioSolo) {
          const ps = precioSolo as { precio: number | string | null; label?: string | null; subtitulo?: string | null };
          actual = formatPrecioDb(ps.precio);
          row = {
            id: resolved,
            label: ps.label ?? null,
            subtitulo: ps.subtitulo ?? null,
            precio: ps.precio,
          };
        }
      }

      const etiqueta = row ? `${row.label ?? ''}`.trim() || kind : kind;
      const precioCambia = actual !== nuevo;

      const baseUpdate = {
        updated_at: now,
        fecha_actualizacion,
        hora_actualizacion,
      };

      const payload = precioCambia
        ? { ...baseUpdate, precio: Number(nuevo) }
        : { ...baseUpdate };

      const { error: e3 } = await supabase.from('precios_combustible').update(payload).eq('id', resolved);

      if (e3) {
        console.error(`[${est.nombre}] Error actualizando ${etiqueta} (${resolved}):`, e3.message);
        hadError = true;
        warnings.push(`[${est.nombre}] Error actualizando ${etiqueta}: ${e3.message}`);
      } else {
        if (precioCambia) {
          console.log(`[${est.nombre}] ${etiqueta}: ${actual} → ${nuevo}`);
          updates.push({
            estacion: est.nombre,
            label: etiqueta,
            from: String(actual ?? ''),
            to: nuevo,
          });
        } else {
          console.log(
            `[${est.nombre}] ${etiqueta}: precio sin cambio; leyenda fecha_actualizacion/hora_actualizacion actualizada.`
          );
        }
      }
    }
  }

  return {
    ok: !hadError,
    error: hadError ? 'Sincronización finalizada con errores (ver warnings).' : undefined,
    estacionesLeidas: rows.length,
    permisos,
    updates,
    warnings: warnings.length ? warnings : undefined,
    durationMs: Date.now() - t0,
  };
}
