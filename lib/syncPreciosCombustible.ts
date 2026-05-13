/**
 * Sincroniza precios desde gasolinamexico.com.mx hacia Supabase.
 * Misma lógica que el script histórico `scripts/sync-precios-combustible.mjs` (ahora este módulo es la fuente única).
 *
 * Requiere: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import ws from 'ws';

const LIST_URL = 'https://www.gasolinamexico.com.mx/estados/sinaloa/mazatlan/';

const PERMISO_POR_ESTACION: { test: (n: string) => boolean; permiso: string }[] = [
  { test: (n) => /santa\s*irene|gsi/i.test(n), permiso: 'PL/2840/EXP/ES/2015' },
  { test: (n) => /pozole|gpo/i.test(n), permiso: 'PL/23676/EXP/ES/2020' },
];

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
  precio: number | string | null;
  updated_at?: string | null;
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
      diesel: parsePriceFromSource(extractCardPrice(html, 'diesel')),
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

function normalizeLabelForMatch(label: string | null | undefined): string {
  return String(label || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

function kindFromLabel(label: string | null | undefined): 'diesel' | 'premium' | 'magna' | null {
  const n = normalizeLabelForMatch(label);
  if (n.includes('diesel')) return 'diesel';
  if (n.includes('premium')) return 'premium';
  if (n.includes('magna')) return 'magna';
  return null;
}

function formatPrecioDb(val: number | string | null | undefined): string | null {
  if (val == null) return null;
  const n = typeof val === 'number' ? val : Number(String(val).replace(',', '.'));
  if (!Number.isFinite(n)) return null;
  return n.toFixed(2);
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
      .select('id,label,precio,updated_at')
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

    for (const row of precRows as PrecioRow[]) {
      const kind = kindFromLabel(row.label);
      if (!kind) {
        warnings.push(`[${est.nombre}] Etiqueta no reconocida: ${row.label}`);
        continue;
      }
      const nuevo = snap[kind];
      if (nuevo == null) continue;

      const actual = formatPrecioDb(row.precio);
      if (actual === nuevo) continue;

      const { error: e3 } = await supabase
        .from('precios_combustible')
        .update({ precio: Number(nuevo), updated_at: now })
        .eq('id', row.id);

      if (e3) {
        console.error(`[${est.nombre}] Error actualizando ${row.label}:`, e3.message);
        hadError = true;
        warnings.push(`[${est.nombre}] Error actualizando ${row.label}: ${e3.message}`);
      } else {
        console.log(`[${est.nombre}] ${row.label}: ${actual} → ${nuevo}`);
        updates.push({
          estacion: est.nombre,
          label: String(row.label ?? ''),
          from: String(actual ?? ''),
          to: nuevo,
        });
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
