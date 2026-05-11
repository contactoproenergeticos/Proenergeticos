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
  CalendarDays,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export type PrecioCombustibleRow = {
  id?: string;
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

const FALLBACK_PRECIOS_VIGENCIA_ISO = '2026-05-11T12:00:00.000Z';

const FALLBACK_ESTACIONES: EstacionRow[] = [
  {
    id: 'fallback-gsi',
    nombre: 'Santa Irene (GSI)',
    marca: 'Estación Blast',
    orden: 1,
    precios_combustible: [
      {
        label: 'Magna',
        subtitulo: '87 Octanos',
        precio: '22.79',
        updated_at: FALLBACK_PRECIOS_VIGENCIA_ISO,
      },
      {
        label: 'Premium',
        subtitulo: '91 Octanos',
        precio: '26.39',
        updated_at: FALLBACK_PRECIOS_VIGENCIA_ISO,
      },
      {
        label: 'Diésel',
        subtitulo: 'UBA',
        precio: '27.39',
        updated_at: FALLBACK_PRECIOS_VIGENCIA_ISO,
      },
    ],
  },
  {
    id: 'fallback-gpo',
    nombre: 'El Pozole (GPO)',
    marca: 'Grupo Proenergéticos Oil Companies',
    orden: 2,
    precios_combustible: [
      {
        label: 'Magna',
        subtitulo: 'Aditivada',
        precio: '23.24',
        updated_at: FALLBACK_PRECIOS_VIGENCIA_ISO,
      },
      {
        label: 'Premium',
        subtitulo: 'Máximo Desempeño',
        precio: '28.98',
        updated_at: FALLBACK_PRECIOS_VIGENCIA_ISO,
      },
      {
        label: 'Diésel',
        subtitulo: 'Industrial',
        precio: '25.40',
        updated_at: FALLBACK_PRECIOS_VIGENCIA_ISO,
      },
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

/** Siempre un arreglo (vacío si no hay relación); evita fallos en .map(). */
function listPrecios(pc: EstacionRow['precios_combustible']): PrecioCombustibleRow[] {
  if (pc == null) return [];
  return Array.isArray(pc) ? pc : [pc];
}

type FuelKind = 'magna' | 'premium' | 'diesel';

/** Compara por subcadena sin depender de acentos (p. ej. Diésel / Diesel). */
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

/** Tres filas fijas por tarjeta (textos visibles aunque no haya datos en Supabase). */
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

/**
 * Garantiza exactamente 3 filas (Magna / Premium / Diésel) fusionando con lo que venga de BD.
 */
function mergeEstacionPrecios(row: EstacionRow): PrecioCombustibleRow[] {
  const tema = resolveTema(row);
  const slots = slotsForTema(tema);
  const fromDb = sortPrecios(listPrecios(row.precios_combustible));
  return slots.map((slot) => {
    const match = fromDb.find((r) => fuelKindFromLabel(r.label) === slot.kind);
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
    return {
      id: match.id,
      label: labelDb || slot.label,
      subtitulo: subDb || slot.subtitulo,
      precio: match.precio,
      updated_at: match.updated_at,
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

function maxUpdatedAt(rows: PrecioCombustibleRow[]): string | null {
  let max: string | null = null;
  for (const r of rows) {
    const u = r.updated_at;
    if (u && String(u).trim() && (!max || String(u) > max)) max = String(u).trim();
  }
  return max;
}

/** Ej. "11 de Mayo de 2026" en zona Mazatlán (sin hora). */
function formatFechaVigencia(iso: string): string {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Mazatlan',
  }).formatToParts(d);
  let day = '';
  let month = '';
  let year = '';
  for (const p of parts) {
    if (p.type === 'day') day = p.value;
    if (p.type === 'month')
      month = p.value.charAt(0).toUpperCase() + p.value.slice(1);
    if (p.type === 'year') year = p.value;
  }
  if (!day || !month || !year) {
    return new Date(iso).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Mazatlan',
    });
  }
  return `${day} de ${month} de ${year}`;
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
  lineaVigencia,
}: {
  nombre: string;
  marca: string;
  borderColor: string;
  marcaColor: string;
  precios: { rowKey: string; label: string; precio: string; color: string; subtitulo: string }[];
  nota: string;
  logoUrl: string;
  badgeClass: string;
  lineaVigencia: string | null;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative h-full group"
  >
    <div className={`h-3 w-full ${borderColor}`}></div>
    <div className="p-6 md:p-10 flex-grow">
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
              sizes="160px"
              unoptimized={true}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {precios.map(({ rowKey, ...p }) => (
          <PrecioItem key={rowKey} {...p} />
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
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
        {lineaVigencia ? (
          <p className="text-[10px] md:text-[11px] font-black text-gray-600 normal-case tracking-tight leading-snug">
            {lineaVigencia}
          </p>
        ) : null}
      </div>
    </div>
  </motion.div>
);

export default function Precios() {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loadingFx, setLoadingFx] = useState(true);
  const [estaciones, setEstaciones] = useState<EstacionRow[]>(FALLBACK_ESTACIONES);
  const [sincronizandoPrecios, setSincronizandoPrecios] = useState(true);

  const vigenciaGlobalIso = useMemo(() => {
    let maxIso: string | null = null;
    for (const e of estaciones) {
      const m = maxUpdatedAt(mergeEstacionPrecios(e));
      if (m && (!maxIso || m > maxIso)) maxIso = m;
    }
    return maxIso;
  }, [estaciones]);

  const textoVigenciaGlobal = useMemo(() => {
    if (!vigenciaGlobalIso) {
      return sincronizandoPrecios
        ? 'Obteniendo la fecha de vigencia desde la base de datos…'
        : 'Vigencia de los precios: no disponible en este momento.';
    }
    return `Precios actualizados al: ${formatFechaVigencia(vigenciaGlobalIso)} (según registro en base de datos).`;
  }, [vigenciaGlobalIso, sincronizandoPrecios]);

  const etiquetaVigenciaBanner = useMemo(() => {
    if (!vigenciaGlobalIso) {
      return sincronizandoPrecios ? 'Cargando fecha de vigencia…' : null;
    }
    return formatFechaVigencia(vigenciaGlobalIso);
  }, [vigenciaGlobalIso, sincronizandoPrecios]);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        if (data && data.rates && data.rates.MXN) {
          setExchangeRate(data.rates.MXN);
        }
      } catch {
        setExchangeRate(17.79);
      } finally {
        setLoadingFx(false);
      }
    };
    fetchExchangeRate();
  }, []);

  useEffect(() => {
    const load = async () => {
      setSincronizandoPrecios(true);
      const { data, error } = await supabase
        .from('estaciones')
        .select(
          `
          id,
          nombre,
          marca,
          orden,
          precios_combustible (
            id,
            label,
            subtitulo,
            precio,
            updated_at
          )
        `
        )
        .order('orden', { ascending: true });

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Precios] Supabase:', error.message);
        }
        setEstaciones(FALLBACK_ESTACIONES);
      } else if (!data || data.length === 0) {
        setEstaciones(FALLBACK_ESTACIONES);
      } else {
        const rows = data as EstacionRow[];
        const algunaSinPrecios = rows.some(
          (e) => listPrecios(e.precios_combustible).length === 0
        );
        if (algunaSinPrecios) {
          const ids = rows.map((e) => e.id);
          const { data: precRows, error: e2 } = await supabase
            .from('precios_combustible')
            .select('id,estacion_id,label,subtitulo,precio,updated_at')
            .in('estacion_id', ids);
          if (!e2 && precRows?.length) {
            setEstaciones(
              rows.map((est) => {
                const embebidos = listPrecios(est.precios_combustible);
                if (embebidos.length > 0) {
                  return est;
                }
                return {
                  ...est,
                  precios_combustible: precRows.filter((p) => p.estacion_id === est.id),
                };
              })
            );
          } else {
            setEstaciones(rows);
          }
        } else {
          setEstaciones(rows);
        }
      }
      setSincronizandoPrecios(false);
    };
    load();
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
      const vigTarjeta = maxUpdatedAt(filas);
      const lineaVigencia = vigTarjeta
        ? `Vigencia de estos precios: ${formatFechaVigencia(vigTarjeta)}`
        : null;
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
        lineaVigencia,
      };
    });
  }, [estaciones]);

  return (
    <div className="space-y-8 md:space-y-12 py-8 md:py-16 bg-gray-200 relative w-full overflow-x-hidden">
      <div className="text-center max-w-4xl mx-auto pt-4 md:pt-8 px-4">
        <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase italic mb-6 leading-none">
          Tablero de <span className="text-[#E30613]">Precios</span>
        </h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex flex-col md:flex-row items-center gap-2 md:gap-6 bg-gray-900 px-10 py-6 rounded-[2.5rem] shadow-2xl mb-10 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <RefreshCw className={`w-6 h-6 ${loadingFx ? 'animate-spin' : ''} text-[#E30613]`} />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
              Tipo de Cambio MXN/USD
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              {loadingFx ? '---' : `$${exchangeRate?.toFixed(2)}`}
            </span>
            <span className="text-xs font-black text-[#E30613] uppercase tracking-widest">MXN</span>
          </div>
        </motion.div>

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

        <div className="bg-gray-900 rounded-[2.5rem] p-10 flex items-center gap-8 border border-white/5 shadow-2xl">
          <Info className="text-[#E30613] w-10 h-10 flex-shrink-0" />
          <p className="text-[11px] text-gray-400 font-black leading-relaxed uppercase tracking-[0.2em]">
            Actualización diaria conforme a mercado. <br />
            <span className="text-white normal-case font-bold tracking-tight">
              {textoVigenciaGlobal}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
