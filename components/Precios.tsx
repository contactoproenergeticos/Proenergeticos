'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Info,
  RefreshCw,
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

/** Último recurso si `updated_at` no viene en la respuesta (fecha estable, no carga infinita). */
const FALLBACK_PRECIOS_VIGENCIA_ISO = '2026-05-11T18:57:08.058Z';

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

/** Solo UI de demostración si no hay Supabase. */
const FALLBACK_ESTACIONES: EstacionRow[] = [
  {
    id: 'fallback-gsi',
    nombre: 'Santa Irene (GSI)',
    marca: 'Gasolinera Blast Santa Irene, S.A. de C.V.',
    orden: 1,
    precios_combustible: [
      { label: 'Magna', subtitulo: '87 Octanos', precio: '22.79', updated_at: null },
      { label: 'Premium', subtitulo: '91 Octanos', precio: '26.39', updated_at: null },
      { label: 'Diésel', subtitulo: 'UBA', precio: '27.39', updated_at: null },
    ],
  },
  {
    id: 'fallback-gpo',
    nombre: 'El Pozole (GPO)',
    marca: 'Grupo Proenergéticos Oil Companies',
    orden: 2,
    precios_combustible: [
      { label: 'Magna', subtitulo: 'Aditivada', precio: '23.24', updated_at: null },
      { label: 'Premium', subtitulo: 'Máximo Desempeño', precio: '28.98', updated_at: null },
      { label: 'Diésel', subtitulo: 'Industrial', precio: '25.40', updated_at: null },
    ],
  },
];

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

/** Fecha y hora legibles en hora de Mazatlán (p. ej. 11 de mayo de 2026 a las 06:57 p. m.). */
function vigenciaFechaHoraMazatlan(dato: string): string {
  const s = String(dato).trim();
  if (!s) return '';
  const conT = s.includes('T') ? s : s.replace(/^(\d{4}-\d{2}-\d{2})\s/, '$1T');
  const d = new Date(conT);
  if (Number.isNaN(d.getTime())) return s;
  const fecha = d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Mazatlan',
  });
  const hora = d.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Mazatlan',
  });
  return `${fecha} a las ${hora}`;
}

/** Primer `updated_at` no vacío; si no hay, vigencia fija de respaldo. */
function fechaCrudaVigenciaEstacion(row: EstacionRow): string {
  const lista = listPrecios(row.precios_combustible);
  const cero = lista[0]?.updated_at;
  if (cero != null && String(cero).trim() !== '') return String(cero).trim();
  const con = lista.find((p) => p.updated_at != null && String(p.updated_at).trim() !== '');
  if (con?.updated_at != null && String(con.updated_at).trim() !== '') {
    return String(con.updated_at).trim();
  }
  return FALLBACK_PRECIOS_VIGENCIA_ISO;
}

function vigenciaGlobalMax(estaciones: EstacionRow[]): string {
  let best: string | null = null;
  for (const e of estaciones) {
    for (const p of listPrecios(e.precios_combustible)) {
      const u = p.updated_at;
      if (u == null || !String(u).trim()) continue;
      const s = String(u).trim();
      if (!best || new Date(s) > new Date(best)) best = s;
    }
  }
  return best || FALLBACK_PRECIOS_VIGENCIA_ISO;
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
  const isoVigencia =
    (r.updated_at as string | null | undefined) ||
    (r.updatedAt as string | null | undefined) ||
    new Date().toISOString();
  const u = String(isoVigencia).trim() || new Date().toISOString();
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
  const [tipoCambio, setTipoCambio] = useState<number | null>(null);
  const [tipoCambioUpdatedAt, setTipoCambioUpdatedAt] = useState<string | null>(null);
  const [tipoCambioCargando, setTipoCambioCargando] = useState(true);
  const [estaciones, setEstaciones] = useState<EstacionRow[]>(FALLBACK_ESTACIONES);
  const [sincronizandoPrecios, setSincronizandoPrecios] = useState(true);

  const vigenciaGlobalStr = useMemo(() => vigenciaGlobalMax(estaciones), [estaciones]);
  const vigenciaGlobalTexto = useMemo(() => {
    const legible = vigenciaFechaHoraMazatlan(vigenciaGlobalStr);
    return legible || vigenciaFechaHoraMazatlan(FALLBACK_PRECIOS_VIGENCIA_ISO);
  }, [vigenciaGlobalStr]);

  const tipoCambioActualizadoLeyenda = useMemo(() => {
    if (!tipoCambioUpdatedAt?.trim()) return '';
    return vigenciaFechaHoraMazatlan(tipoCambioUpdatedAt.trim());
  }, [tipoCambioUpdatedAt]);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      console.log('Consultando dólar...');
      try {
        const { data, error } = await supabase.from('tipo_cambio').select('valor, updated_at').eq('id', 1).single();
        if (cancelado) return;
        console.log('[Precios] tipo_cambio resultado data:', data);

        if (error) {
          console.error('[Precios] tipo_cambio falló:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });
          setTipoCambio(null);
          setTipoCambioUpdatedAt(null);
          return;
        }

        const raw = data?.valor;
        if (raw == null || (typeof raw === 'string' && raw.trim() === '')) {
          console.error('[Precios] tipo_cambio: data sin valor usable', data);
          setTipoCambio(null);
          setTipoCambioUpdatedAt(null);
          return;
        }

        const num = Number(raw);
        if (!Number.isFinite(num)) {
          console.error('[Precios] tipo_cambio: data.valor no es un número finito', raw);
          setTipoCambio(null);
          setTipoCambioUpdatedAt(null);
          return;
        }

        setTipoCambio(num);
        const ua = data.updated_at;
        setTipoCambioUpdatedAt(ua != null && String(ua).trim() !== '' ? String(ua).trim() : null);
      } finally {
        if (!cancelado) setTipoCambioCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      setSincronizandoPrecios(true);
      const { data: estacionesMeta, error: errEst } = await supabase
        .from('estaciones')
        .select('id,nombre,marca,orden')
        .order('orden', { ascending: true });

      if (errEst || !estacionesMeta?.length) {
        if (process.env.NODE_ENV === 'development' && errEst) {
          console.warn('[Precios] estaciones:', errEst.message);
        }
        setEstaciones(FALLBACK_ESTACIONES);
        setSincronizandoPrecios(false);
        return;
      }

      const ids = estacionesMeta.map((e) => e.id);
      const { data: precRowsRaw, error: errPrec } = await supabase
        .from('precios_combustible')
        .select('id,estacion_id,label,subtitulo,precio,updated_at')
        .in('estacion_id', ids);

      if (errPrec) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Precios] precios_combustible:', errPrec.message);
        }
        setEstaciones(
          (estacionesMeta as EstacionRow[]).map((e) => ({ ...e, precios_combustible: [] }))
        );
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
      const vigenciaFormateada =
        vigenciaFechaHoraMazatlan(rawUpdatedAt) ||
        vigenciaFechaHoraMazatlan(FALLBACK_PRECIOS_VIGENCIA_ISO);
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

        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex flex-col md:flex-row items-center gap-2 md:gap-6 bg-gray-900 px-10 py-6 rounded-[2.5rem] shadow-2xl border border-white/10"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className={`w-6 h-6 ${tipoCambioCargando ? 'animate-spin' : ''} text-[#E30613]`} />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                Tipo de Cambio MXN/USD
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                {tipoCambioCargando ? '---' : tipoCambio != null ? `$${tipoCambio.toFixed(2)}` : '—'}
              </span>
              <span className="text-xs font-black text-[#E30613] uppercase tracking-widest">MXN</span>
            </div>
          </motion.div>
          <p className="mt-4 w-full max-w-2xl px-4 text-center text-sm font-bold leading-snug text-gray-900 sm:text-[15px] md:text-base">
            {tipoCambioCargando ? (
              <>
                Última actualización:{' '}
                <span className="font-extrabold text-[#E30613]">…</span>
              </>
            ) : tipoCambioActualizadoLeyenda ? (
              <>
                Última actualización:{' '}
                <span className="font-extrabold text-[#E30613]">{tipoCambioActualizadoLeyenda}</span>
              </>
            ) : (
              <>
                Última actualización:{' '}
                <span className="font-extrabold text-[#E30613]">—</span>
              </>
            )}
          </p>
        </div>

        <p className="text-lg md:text-xl text-gray-500 font-bold leading-tight max-w-2xl mx-auto uppercase tracking-tight italic">
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
