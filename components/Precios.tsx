'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Info,
  Receipt,
  ChevronRight,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const NOTA_CRE_PIE =
  'Precios oficiales obtenidos del portal de la Comisión Reguladora de Energía (CRE). Actualización automática sincronizada con los precios vigentes.';

/** Misma leyenda en cada tarjeta (pie legal CRE). */
const NOTA_CRE_TARJETA = NOTA_CRE_PIE;

/**
 * Tablas Supabase (ver `supabase/migrations/20260511120000_estaciones_precios_combustible.sql`):
 * - `estaciones`: id, nombre, marca, orden
 * - `precios_combustible`: id, estacion_id → estaciones, label, subtitulo, precio (numeric), updated_at (timestamptz)
 */

export type PrecioCombustibleRow = {
  id?: string;
  estacion_id?: string;
  label: string | null;
  subtitulo: string | null;
  precio: number | string | null;
  updated_at: string | null;
};

export type EstacionRow = {
  id: string;
  nombre: string;
  marca: string;
  orden: number;
  precios_combustible: PrecioCombustibleRow[] | PrecioCombustibleRow | null;
};

type TemaEstacion = 'blast' | 'proener';

const TEMA_UI: Record<
  TemaEstacion,
  { borderColor: string; marcaColor: string; logoUrl: string; badgeClass: string; nota: string }
> = {
  blast: {
    borderColor: 'border-[#E30613]',
    marcaColor: 'text-[#E30613]',
    logoUrl: '/images/logotipos/BLAST.png',
    badgeClass: 'bg-amber-100 text-amber-700',
    nota: 'Tecnología Alemana',
  },
  proener: {
    borderColor: 'border-gray-900',
    marcaColor: 'text-gray-900',
    logoUrl: '/images/logotipos/ProEner_negro.png',
    badgeClass: 'bg-gray-100 text-gray-900',
    nota: 'Garantía de Origen',
  },
};

/** Misma clave al agrupar precios y al buscar por `estaciones.id` (evita fallos UUID mayúsculas/minúsculas). */
function claveEstacionId(id: string): string {
  return String(id).replace(/-/g, '').toLowerCase();
}

function listPrecios(pc: EstacionRow['precios_combustible']): PrecioCombustibleRow[] {
  if (pc == null) return [];
  return Array.isArray(pc) ? pc : [pc];
}

type FuelKind = 'magna' | 'premium' | 'diesel';

function normalizeLabelForMatch(label: string | null | undefined): string {
  return String(label || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

function fuelKindFromLabel(label: string | null | undefined): FuelKind | null {
  const n = normalizeLabelForMatch(label);
  if (n.includes('diesel')) return 'diesel';
  if (n.includes('premium')) return 'premium';
  if (n.includes('magna')) return 'magna';
  return null;
}

function findPrecioRowForSlot(fromDb: PrecioCombustibleRow[], kind: FuelKind): PrecioCombustibleRow | undefined {
  const byKind = fromDb.find((r) => fuelKindFromLabel(r.label) === kind);
  if (byKind) return byKind;
  const needle = kind === 'magna' ? 'magna' : kind === 'premium' ? 'premium' : 'diesel';
  return fromDb.find((r) => normalizeLabelForMatch(r.label).includes(needle));
}

const SLOTS_BLAST: { kind: FuelKind; label: string; subtitulo: string }[] = [
  { kind: 'magna', label: 'Magna', subtitulo: '87 Octanos' },
  { kind: 'premium', label: 'Premium', subtitulo: '91 Octanos' },
  { kind: 'diesel', label: 'Diésel', subtitulo: 'UBA' },
];

const SLOTS_PROENER: { kind: FuelKind; label: string; subtitulo: string }[] = [
  { kind: 'magna', label: 'Magna', subtitulo: 'Aditivada' },
  { kind: 'premium', label: 'Premium', subtitulo: 'Máximo Desempeño' },
  { kind: 'diesel', label: 'Diésel', subtitulo: 'Industrial' },
];

function slotsForTema(tema: TemaEstacion) {
  return tema === 'blast' ? SLOTS_BLAST : SLOTS_PROENER;
}

function mergeEstacionPrecios(row: EstacionRow): PrecioCombustibleRow[] {
  const tema = resolveTema(row);
  const slots = slotsForTema(tema);
  const fromDb = sortPrecios(listPrecios(row.precios_combustible));
  return slots.map((slot) => {
    const match = findPrecioRowForSlot(fromDb, slot.kind);
    if (!match) {
      return {
        label: slot.label,
        subtitulo: slot.subtitulo,
        precio: null,
        updated_at: null,
      };
    }
    const labelDb = String(match.label ?? '').trim();
    const subDb = String(match.subtitulo ?? '').trim();
    const u = match.updated_at;
    return {
      id: match.id,
      label: labelDb || slot.label,
      subtitulo: subDb || slot.subtitulo,
      precio: match.precio,
      updated_at: u != null && String(u).trim() !== '' ? String(u) : null,
    };
  });
}

function resolveTema(row: Pick<EstacionRow, 'marca' | 'nombre'>): TemaEstacion {
  const t = `${row.marca} ${row.nombre}`.toLowerCase();
  if (t.includes('blast') || t.includes('santa irene') || t.includes(' gsi')) return 'blast';
  return 'proener';
}

function sortPrecios(rows: PrecioCombustibleRow[]): PrecioCombustibleRow[] {
  const rank = (label: string | null) => {
    const k = fuelKindFromLabel(label);
    if (k === 'diesel') return 2;
    if (k === 'premium') return 1;
    if (k === 'magna') return 0;
    return 50;
  };
  return [...rows].sort((a, b) => {
    const d = rank(a.label) - rank(b.label);
    return d !== 0 ? d : (a.label || '').localeCompare(b.label || '', 'es');
  });
}

function colorForLabel(label: string | null): string {
  const n = normalizeLabelForMatch(label);
  if (n.includes('premium')) return 'text-red-600';
  if (n.includes('diesel')) return 'text-gray-900';
  if (n.includes('magna')) return 'text-green-600';
  return 'text-gray-900';
}

function formatPrecioDisplay(v: number | string | null): string {
  if (v === null || v === undefined) return '--';
  const s = String(v).trim();
  if (s === '') return '--';
  const n = typeof v === 'number' ? v : Number(s.replace(',', '.'));
  if (!Number.isFinite(n)) return '--';
  return n.toFixed(2);
}

/** Zona horaria de Mazatlán (Sinaloa); el IANA `America/Mazatlan` refleja el huso oficial (p. ej. UTC−7 en invierno). */
const TIMEZONE_MAZATLAN = 'America/Mazatlan';

/**
 * Fecha/hora legibles del `updated_at` de Supabase (timestamptz guardado en UTC, mostrado en hora de Mazatlán).
 */
function vigenciaFechaHoraLegible(dato: string): string {
  const s = String(dato).trim();
  if (!s) return '';
  const conT = s.includes('T') ? s : s.replace(/^(\d{4}-\d{2}-\d{2})\s/, '$1T');
  const d = new Date(conT);
  if (Number.isNaN(d.getTime())) return s;
  const fecha = d.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TIMEZONE_MAZATLAN,
  });
  const hora = d.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: TIMEZONE_MAZATLAN,
  });
  return `${fecha}, ${hora} (hora Mazatlán)`;
}

/** Mayor `updated_at` entre las filas de precios de la estación (más reciente sincronización visible en tarjeta). */
function fechaCrudaVigenciaEstacion(row: EstacionRow): string | null {
  const lista = listPrecios(row.precios_combustible);
  let best: string | null = null;
  for (const p of lista) {
    const u = p.updated_at;
    if (u == null || !String(u).trim()) continue;
    const t = String(u).trim();
    if (!best || new Date(t) > new Date(best)) best = t;
  }
  return best;
}

function vigenciaGlobalMax(estaciones: EstacionRow[]): string | null {
  let best: string | null = null;
  for (const e of estaciones) {
    for (const p of listPrecios(e.precios_combustible)) {
      const u = p.updated_at;
      if (u == null || !String(u).trim()) continue;
      const s = String(u).trim();
      if (!best || new Date(s) > new Date(best)) best = s;
    }
  }
  return best;
}

const PrecioItem = ({
  label,
  precio,
  color,
  subtitulo,
}: {
  label: string;
  precio: string;
  color: string;
  subtitulo: string;
}) => (
  <div className="flex flex-col items-center justify-center py-4 border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50/50">
    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
      {subtitulo}
    </span>
    <h4 className="text-lg font-black text-gray-900 tracking-tighter uppercase italic mb-1">
      {label}
    </h4>
    <div className="flex items-baseline gap-1">
      <span className="text-xl font-black text-gray-400">$</span>
      <span className={`text-5xl font-black tracking-tighter ${color}`}>{precio}</span>
    </div>
  </div>
);

const EstacionCard = ({
  nombre,
  marca,
  borderColor,
  marcaColor,
  precios,
  nota,
  logoUrl,
  badgeClass,
  vigenciaFormateada,
}: {
  nombre: string;
  marca: string;
  borderColor: string;
  marcaColor: string;
  precios: { rowKey: string; label: string; precio: string; color: string; subtitulo: string }[];
  nota: string;
  logoUrl: string;
  badgeClass: string;
  vigenciaFormateada: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative h-full group"
  >
    <div className={`h-3 w-full ${borderColor}`}></div>
    <div className="p-6 md:p-10 flex-grow flex flex-col">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 min-h-[100px] gap-6">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-tight mb-2">
            {nombre}
          </h3>
          <p className={`text-[11px] md:text-sm font-black tracking-widest uppercase ${marcaColor}`}>
            {marca}
          </p>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className="w-28 md:w-40 h-20 md:h-24 flex items-center justify-center relative transition-transform duration-500 group-hover:scale-110">
            <Image
              src={logoUrl}
              alt={marca}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized={true}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 flex-1 min-h-0">
        {precios.map(({ rowKey, ...p }) => (
          <PrecioItem key={rowKey} {...p} />
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${badgeClass}`}>
              {nota}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              Verificado CRE
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-200 pb-1">
        <p className="text-sm text-gray-900 normal-case leading-snug">
          <span className="font-black">Última actualización:</span>{' '}
          <span className="font-extrabold text-gray-900">{vigenciaFormateada}</span>
        </p>
        <p className="mt-1 text-xs sm:text-[11px] text-slate-700 normal-case leading-relaxed font-medium max-w-prose mx-auto md:mx-0">
          {NOTA_CRE_TARJETA}
        </p>
      </div>
    </div>
  </motion.div>
);

type PrecioApiRow = {
  id?: string;
  estacion_id?: string;
  label?: string | null;
  subtitulo?: string | null;
  precio?: number | string | null;
  updated_at?: string | null;
};

function precioDesdeSelect(p: PrecioApiRow): PrecioCombustibleRow {
  const r = p as Record<string, unknown>;
  const raw =
    (r.updated_at as string | null | undefined) ??
    (r.updatedAt as string | null | undefined) ??
    null;
  const u = raw != null && String(raw).trim() !== '' ? String(raw).trim() : null;
  return {
    id: p.id != null ? String(p.id) : undefined,
    estacion_id: p.estacion_id != null ? String(p.estacion_id) : undefined,
    label: p.label ?? null,
    subtitulo: p.subtitulo ?? null,
    precio: p.precio ?? null,
    updated_at: u,
  };
}

export default function Precios() {
  const [estaciones, setEstaciones] = useState<EstacionRow[]>([]);
  const [sincronizandoPrecios, setSincronizandoPrecios] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  /** Falló solo `precios_combustible`; dejamos filas de estación para mostrar tarjetas con precios `--`. */
  const [advertenciaPrecios, setAdvertenciaPrecios] = useState<string | null>(null);

  const vigenciaGlobalStr = useMemo(() => vigenciaGlobalMax(estaciones), [estaciones]);
  const vigenciaGlobalTexto = useMemo(() => {
    if (!vigenciaGlobalStr) {
      return 'Aún no hay fechas de actualización en la base de datos.';
    }
    return vigenciaFechaHoraLegible(vigenciaGlobalStr);
  }, [vigenciaGlobalStr]);

  useEffect(() => {
    const load = async () => {
      setSincronizandoPrecios(true);
      setErrorCarga(null);
      setAdvertenciaPrecios(null);
      const { data: estacionesMeta, error: errEst } = await supabase
        .from('estaciones')
        .select('id,nombre,marca,orden')
        .order('orden', { ascending: true });

      if (errEst || !estacionesMeta?.length) {
        if (process.env.NODE_ENV === 'development' && errEst) {
          console.warn('[Precios] estaciones:', errEst.message);
        }
        setEstaciones([]);
        setErrorCarga(
          errEst?.message ??
            'No hay estaciones en la base de datos o no se pudo conectar. Revisa las variables NEXT_PUBLIC_SUPABASE_* y las políticas RLS.'
        );
        setSincronizandoPrecios(false);
        return;
      }

      const ids = estacionesMeta.map((e) => e.id);
      const { data: precRowsRaw, error: errPrec } = await supabase
        .from('precios_combustible')
        .select('id,estacion_id,label,subtitulo,precio,updated_at')
        .in('estacion_id', ids)
        .order('updated_at', { ascending: false });

      if (errPrec) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Precios] precios_combustible:', errPrec.message);
        }
        setEstaciones(
          (estacionesMeta as EstacionRow[]).map((e) => ({ ...e, precios_combustible: [] }))
        );
        setAdvertenciaPrecios(errPrec.message);
        setSincronizandoPrecios(false);
        return;
      }

      const precRows = (precRowsRaw ?? []) as PrecioApiRow[];
      const porEstacion = new Map<string, PrecioCombustibleRow[]>();
      for (const raw of precRows) {
        const sid = raw.estacion_id != null ? String(raw.estacion_id) : '';
        if (!sid) continue;
        const row = precioDesdeSelect(raw);
        const key = claveEstacionId(sid);
        const arr = porEstacion.get(key) ?? [];
        arr.push(row);
        porEstacion.set(key, arr);
      }

      const merged = (estacionesMeta as EstacionRow[]).map((est) => ({
        ...est,
        precios_combustible: porEstacion.get(claveEstacionId(est.id)) ?? [],
      }));

      setEstaciones(merged);
      setSincronizandoPrecios(false);
    };
    void load();
  }, []);

  const tarjetas = useMemo(() => {
    return estaciones.map((row) => {
      const tema = resolveTema(row);
      const ui = TEMA_UI[tema];
      const filas = mergeEstacionPrecios(row);
      const precios = filas.map((r, i) => ({
        rowKey: r.id ?? `${row.id}-${i}-${r.label ?? i}`,
        label: String(r.label ?? ''),
        subtitulo: r.subtitulo?.trim() ? String(r.subtitulo) : '--',
        color: colorForLabel(r.label),
        precio: formatPrecioDisplay(r.precio),
      }));
      const rawUpdatedAt = fechaCrudaVigenciaEstacion(row);
      const vigenciaFormateada = rawUpdatedAt
        ? vigenciaFechaHoraLegible(rawUpdatedAt)
        : 'Sin fecha de actualización en la base de datos.';
      return {
        key: row.id,
        nombre: row.nombre,
        marca: row.marca,
        nota: ui.nota,
        borderColor: ui.borderColor,
        marcaColor: ui.marcaColor,
        logoUrl: ui.logoUrl,
        badgeClass: ui.badgeClass,
        precios,
        vigenciaFormateada,
      };
    });
  }, [estaciones]);

  return (
    <div className="space-y-8 md:space-y-12 py-8 md:py-16 bg-gray-200 relative w-full overflow-x-hidden">
      <div className="text-center max-w-4xl mx-auto pt-4 md:pt-8 px-4">
        <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase italic mb-6 leading-none">
          Tablero de <span className="text-[#E30613]">Precios</span>
        </h2>

        <p className="text-lg md:text-xl text-gray-500 font-bold leading-tight max-w-2xl mx-auto uppercase tracking-tight italic mb-10">
          Combustibles de alta calidad con garantía de litraje exacto en Mazatlán.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 px-4 relative">
        {sincronizandoPrecios ? (
          <div
            className="pointer-events-none absolute inset-x-4 top-0 z-10 flex justify-end"
            aria-hidden
          >
            <span className="rounded-full bg-white/90 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-gray-500 shadow-sm border border-gray-100">
              Actualizando…
            </span>
          </div>
        ) : null}
        {!sincronizandoPrecios && errorCarga ? (
          <div className="lg:col-span-2 rounded-[2rem] border border-amber-200 bg-amber-50/90 p-8 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-amber-900 mb-2">
              No se pudieron cargar los precios
            </p>
            <p className="text-sm text-amber-950/90 font-medium normal-case max-w-2xl mx-auto">
              {errorCarga}
            </p>
          </div>
        ) : null}
        {!sincronizandoPrecios && advertenciaPrecios ? (
          <div className="lg:col-span-2 rounded-[2rem] border border-amber-200 bg-amber-50/90 p-6 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-amber-900 mb-1">
              No se pudieron cargar los importes desde Supabase
            </p>
            <p className="text-sm text-amber-950/90 font-medium normal-case max-w-2xl mx-auto">
              {advertenciaPrecios}
            </p>
          </div>
        ) : null}
        {!sincronizandoPrecios && !errorCarga && estaciones.length === 0 ? (
          <div className="lg:col-span-2 rounded-[2rem] border border-gray-200 bg-white p-10 text-center text-gray-600 font-medium">
            No hay estaciones configuradas para mostrar precios.
          </div>
        ) : null}
        {tarjetas.map(({ key: stationKey, ...card }) => (
          <EstacionCard key={stationKey} {...card} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[4rem] p-10 md:p-14 border border-gray-100 shadow-xl flex flex-col lg:flex-row items-center gap-12"
        >
          <div className="bg-gray-900 p-8 rounded-[3rem] shadow-xl">
            <Receipt className="w-14 h-14 text-[#E30613]" />
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-4xl md:text-5xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-4">
              Facturación <span className="text-[#E30613]">Digital</span>
            </h3>
            <p className="text-base md:text-lg text-gray-500 font-bold leading-relaxed italic max-w-xl uppercase tracking-tight">
              Genera tu factura electrónica seleccionando tu estación en nuestro portal dedicado.
            </p>
          </div>

          <Link
            href="/facturacion"
            className="w-full lg:w-auto bg-[#E30613] hover:bg-gray-900 text-white font-black uppercase tracking-[0.25em] text-sm px-14 py-7 rounded-[2.5rem] flex items-center justify-center gap-4 transition-all duration-300 shadow-2xl shadow-red-500/30 group"
          >
            <span>Facturar Aquí</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8">
        <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] p-10 flex items-start gap-6 border border-white/60">
          <AlertCircle className="w-10 h-10 text-[#E30613] flex-shrink-0" />
          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">
              Aviso Importante
            </p>
            <p className="text-xs text-gray-700 font-bold italic leading-relaxed uppercase">
              El precio vigente es el mostrado directamente en la pantalla de la bomba despachadora.
            </p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-[2.5rem] p-10 flex flex-col sm:flex-row gap-6 sm:gap-8 sm:items-start border border-white/5 shadow-2xl">
          <Info className="text-[#E30613] w-10 h-10 flex-shrink-0 mx-auto sm:mx-0" />
          <div className="min-w-0 flex-1 space-y-3 text-center sm:text-left">
            <p className="text-xs md:text-sm text-slate-200/95 normal-case leading-relaxed font-medium">
              {NOTA_CRE_PIE}
            </p>
            <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] border-t border-white/10 pt-3">
              Última actualización del tablero
            </p>
            <p className="text-sm text-white font-extrabold normal-case leading-snug">
              {vigenciaGlobalTexto}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
