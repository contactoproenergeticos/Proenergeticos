/**
 * Sincroniza precios desde gasolinamexico.com.mx hacia Supabase.
 * Esquema relacional: `precios_combustible` (label, subtitulo, precio, estacion_id, updated_at).
 *
 * Requiere: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Recomendado: npm run sync:precios (carga .env.local en Node 20+)
 *
 * Si la fuente devuelve "?" o vacío, no se actualiza esa fila (se conserva el último precio).
 */

import { createClient } from '@supabase/supabase-js';

const LIST_URL = 'https://www.gasolinamexico.com.mx/estados/sinaloa/mazatlan/';

/** Mapeo nombre estación → permiso CRE en Gasolina México (scraping). */
const PERMISO_POR_ESTACION = [
  { test: (n) => /santa\s*irene|gsi/i.test(n), permiso: 'PL/2840/EXP/ES/2015' },
  { test: (n) => /pozole|gpo/i.test(n), permiso: 'PL/23676/EXP/ES/2020' },
];

const FETCH_HEADERS = {
  Accept: 'text/html,application/xhtml+xml',
  'Accept-Language': 'es-MX,es;q=0.9',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function absolutizeWww(url) {
  return url.replace(
    /^https:\/\/gasolinamexico\.com\.mx\//,
    'https://www.gasolinamexico.com.mx/'
  );
}

function collectStationLinks(html) {
  const set = new Set();
  const re = /href="(https:\/\/[^"]*\/estacion\/[^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    set.add(absolutizeWww(m[1]));
  }
  return [...set];
}

function extractPermiso(html) {
  const match = html.match(/<strong>Permiso:<\/strong>\s*([^<]+)/i);
  return match ? match[1].trim().replace(/\s+/g, '') : null;
}

function extractCardPrice(html, cardClass) {
  const re = new RegExp(
    `<div class="card ${cardClass}"[\\s\\S]*?<p>([^<]*)<\\/p>`,
    'i'
  );
  const m = html.match(re);
  if (!m) return null;
  return m[1].trim();
}

function parsePriceFromSource(raw) {
  if (raw == null) return null;
  const t = String(raw).trim();
  if (!t || t === '?' || t === '—' || t === '-' || /^n\/?d$/i.test(t)) return null;
  const withNum = t.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (!withNum) return null;
  const n = Number(withNum[1]);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n.toFixed(2);
}

async function fetchText(url) {
  const res = await fetch(url, { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

async function scrapeByPermisos(permisos) {
  const listHtml = await fetchText(LIST_URL);
  const links = collectStationLinks(listHtml);
  const pending = new Set(permisos);
  const out = {};

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

function permisoDesdeNombre(nombre) {
  const n = String(nombre || '');
  for (const { test, permiso } of PERMISO_POR_ESTACION) {
    if (test(n)) return permiso;
  }
  return null;
}

function normalizeLabelForMatch(label) {
  return String(label || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

function kindFromLabel(label) {
  const n = normalizeLabelForMatch(label);
  if (n.includes('diesel')) return 'diesel';
  if (n.includes('premium')) return 'premium';
  if (n.includes('magna')) return 'magna';
  return null;
}

function formatPrecioDb(val) {
  if (val == null) return null;
  const n = typeof val === 'number' ? val : Number(String(val).replace(',', '.'));
  if (!Number.isFinite(n)) return null;
  return n.toFixed(2);
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.'
    );
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: estaciones, error: e1 } = await supabase
    .from('estaciones')
    .select('id,nombre,orden,permiso_cre')
    .order('orden', { ascending: true });

  if (e1) {
    console.error('Error leyendo estaciones:', e1.message);
    process.exit(1);
  }
  if (!estaciones?.length) {
    console.error('No hay filas en estaciones.');
    process.exit(1);
  }

  function permisoParaEstacion(est) {
    const desdeTabla = est.permiso_cre && String(est.permiso_cre).trim();
    if (desdeTabla) return desdeTabla;
    return permisoDesdeNombre(est.nombre);
  }

  const permisos = [...new Set(estaciones.map(permisoParaEstacion).filter(Boolean))];
  if (!permisos.length) {
    console.error(
      'Ninguna estación tiene permiso_cre en la base ni coincide con PERMISO_POR_ESTACION por nombre.'
    );
    process.exit(1);
  }

  const scraped = await scrapeByPermisos(permisos);
  const now = new Date().toISOString();
  let hadError = false;

  for (const est of estaciones) {
    const perm = permisoParaEstacion(est);
    if (!perm) {
      console.warn(`[${est.nombre}] Sin permiso CRE (columna o nombre); se omite.`);
      continue;
    }
    const snap = scraped[perm];
    if (!snap) continue;

    const { data: rows, error: e2 } = await supabase
      .from('precios_combustible')
      .select('id,label,precio,updated_at')
      .eq('estacion_id', est.id);

    if (e2) {
      console.error(`[${est.nombre}] Error leyendo precios:`, e2.message);
      hadError = true;
      continue;
    }

    if (!rows?.length) {
      console.warn(`[${est.nombre}] Sin filas en precios_combustible; inserta filas o aplica migración.`);
      continue;
    }

    for (const row of rows) {
      const kind = kindFromLabel(row.label);
      if (!kind) {
        console.warn(`[${est.nombre}] Etiqueta no reconocida: ${row.label}`);
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
      } else {
        console.log(`[${est.nombre}] ${row.label}: ${actual} → ${nuevo}`);
      }
    }
  }

  if (hadError) {
    console.error('Sincronización finalizada con errores.');
    process.exit(1);
  }
  console.log('Sincronización terminada.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
