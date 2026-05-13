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
import { fuelKindFromParts, normalizeFuelText, type FuelKind } from '@/lib/fuelLabelKind';

const NOTA_CRE_PIE =
  'Precios oficiales obtenidos del portal de la Comisión Reguladora de Energía (CRE). Actualización automática sincronizada con los precios vigentes.';

/** Misma leyenda en cada tarjeta (pie legal CRE). */
const NOTA_CRE_TARJETA = NOTA_CRE_PIE;

/**
 * Última actualización: solo se muestran los textos `fecha_actualizacion` y `hora_actualizacion`
 * guardados en Supabase por el job de sincronización.
 */

export type PrecioCombustibleRow = {
  id?: string;
  estacion_id?: string;
  label: string | null;
  subtitulo: string | null;
  precio: number | string | null;
  fecha_actualizacion: string | null;
  hora_actualizacion: string | null;
};

export type EstacionRow = {
  id: string;
  nombre: string;
  marca: string;
  orden: number;
  precios_combustible: PrecioCombustibleRow[] | PrecioCombustibleRow | null;
};

/**
 * Dos huecos fijos en el grid (misma maqueta siempre) cuando aún no hay datos o falló la conexión.
 * Los nombres en `--` indican que la información no está disponible.
 */
const PLACEHOLDER_ESTACIONES: EstacionRow[] = [
  {
    id: '__placeholder-1',
    nombre: '--',
    marca: '--',
    orden: 1,
    precios_combustible: [],
  },
  {
    id: '__placeholder-2',
    nombre: '--',
    marca: '--',
    orden: 2,
    precios_combustible: [],
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

function findPrecioRowForSlot(fromDb: PrecioCombustibleRow[], kind: FuelKind): PrecioCombustibleRow | undefined {
  const byKind = fromDb.find((r) => fuelKindFromParts(r.label, r.subtitulo) === kind);
  if (byKind) return byKind;
  const needle = kind === 'magna' ? 'magna' : kind === 'premium' ? 'premium' : 'diesel';
  return fromDb.find((r) => normalizeFuelText(r.label).includes(needle));
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
        fecha_actualizacion: null,
        hora_actualizacion: null,
      };
    }
    const labelDb = String(match.label ?? '').trim();
    const subDb = String(match.subtitulo ?? '').trim();
    const fa = match.fecha_actualizacion;
    const ha = match.hora_actualizacion;
    return {
      id: match.id,
      label: labelDb || slot.label,
      subtitulo: subDb || slot.subtitulo,
      precio: match.precio,
      fecha_actualizacion: fa != null && String(fa).trim() !== '' ? String(fa) : null,
      hora_actualizacion: ha != null && String(ha).trim() !== '' ? String(ha) : null,
    };
  });
}

function resolveTema(row: Pick<EstacionRow, 'marca' | 'nombre'>): TemaEstacion {
  const t = `${row.marca} ${row.nombre}`.toLowerCase();
  if (t.includes('blast') || t.includes('santa irene') || t.includes(' gsi')) return 'blast';
  return 'proener';
}

/** Placeholders: misma estética Blast / ProEner que las estaciones reales. */
function resolveTemaVisual(row: EstacionRow, index: number): TemaEstacion {
  if (row.id.startsWith('__placeholder')) {
    return index === 0 ? 'blast' : 'proener';
  }
  return resolveTema(row);
}

function sortPrecios(rows: PrecioCombustibleRow[]): PrecioCombustibleRow[] {
  const rank = (label: string | null, subtitulo: string | null) => {
    const k = fuelKindFromParts(label, subtitulo);
    if (k === 'diesel') return 2;
    if (k === 'premium') return 1;
    if (k === 'magna') return 0;
    return 50;
  };
  return [...rows].sort((a, b) => {
    const d = rank(a.label, a.subtitulo) - rank(b.label, b.subtitulo);
    return d !== 0 ? d : (a.label || '').localeCompare(b.label || '', 'es');
  });
}

function colorForLabel(label: string | null): string {
  const n = normalizeFuelText(label);
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

function displayOrDash(value: string | null | undefined): string {
  const t = String(value ?? '').trim();
  return t.length > 0 ? t : '--';
}

/** Primera fecha/hora no vacía entre filas de precios (misma estación o tablero global). */
function lineaUltimaActualizacion(rows: PrecioCombustibleRow[]): string {
  let fecha = '';
  let hora = '';
  for (const r of rows) {
    const f = r.fecha_actualizacion?.trim();
    const h = r.hora_actualizacion?.trim();
    if (!fecha && f) fecha = f;
    if (!hora && h) hora = h;
    if (fecha && hora) break;
  }
  return `${displayOrDash(fecha)} · ${displayOrDash(hora)}`;
}

const PrecioItem = ({
  label,
  precio,
  color,
  subtitulo,
  mostrarEsqueleto,
}: {
  label: string;
  precio: string;
  color: string;
  subtitulo: string;
  mostrarEsqueleto?: boolean;
}) => (
  <div className="flex flex-col items-center justify-center py-4 border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50/50">
    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
      {subtitulo}
    </span>
    <h4 className="text-lg font-black text-gray-900 tracking-tighter uppercase italic mb-1">
      {label}
    </h4>
    <div className="flex min-h-[3rem] items-center justify-center gap-1">
      {mostrarEsqueleto ? (
        <span className="inline-block h-12 w-28 rounded-xl bg-gray-200 animate-pulse" aria-hidden />
      ) : (
        <>
          <span className="text-xl font-black text-gray-400">$</span>
          <span className={`text-5xl font-black tracking-tighter ${color}`}>{precio}</span>
        </>
      )}
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
  vigenciaPrincipal,
  tituloEsqueleto,
  logoEsqueleto,
}: {
  nombre: string;
  marca: string;
  borderColor: string;
  marcaColor: string;
  precios: {
    rowKey: string;
    label: string;
    precio: string;
    color: string;
    subtitulo: string;
    mostrarEsqueleto?: boolean;
  }[];
  nota: string;
  logoUrl: string;
  badgeClass: string;
  vigenciaPrincipal: string;
  /** Pulso en título/marca (carga inicial). */
  tituloEsqueleto?: boolean;
  /** Pulso en lugar del logo. */
  logoEsqueleto?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative h-full min-h-[420px] md:min-h-[480px] group"
  >
    <div className={`h-3 w-full ${borderColor}`}></div>
    <div className="p-6 md:p-10 flex-grow flex flex-col">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 min-h-[100px] gap-6">
        <div className="flex-1 text-center md:text-left w-full min-h-[4.5rem] flex flex-col justify-center">
          {tituloEsqueleto ? (
            <>
              <span className="block h-9 md:h-11 w-3/4 max-w-xs mx-auto md:mx-0 rounded-lg bg-gray-200 animate-pulse mb-3" />
              <span className="block h-4 w-1/2 max-w-[12rem] mx-auto md:mx-0 rounded-md bg-gray-100 animate-pulse" />
            </>
          ) : (
            <>
              <h3 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-tight mb-2">
                {nombre}
              </h3>
              <p className={`text-[11px] md:text-sm font-black tracking-widest uppercase ${marcaColor}`}>
                {marca}
              </p>
            </>
          )}
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className="w-28 md:w-40 h-20 md:h-24 flex items-center justify-center relative transition-transform duration-500 group-hover:scale-110">
            {logoEsqueleto ? (
              <span className="inline-block w-24 md:w-32 h-16 md:h-20 rounded-2xl bg-gray-200 animate-pulse" aria-hidden />
            ) : (
              <Image
                src={logoUrl}
                alt={marca}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized={true}
              />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 flex-1 min-h-0">
        {precios.map(({ rowKey, mostrarEsqueleto, ...p }) => (
          <PrecioItem key={rowKey} {...p} mostrarEsqueleto={mostrarEsqueleto} />
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
          <span className="font-extrabold text-gray-900">{vigenciaPrincipal}</span>
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
  fecha_actualizacion?: string | null;
  hora_actualizacion?: string | null;
};

function precioDesdeSelect(p: PrecioApiRow): PrecioCombustibleRow {
  const r = p as Record<string, unknown>;
  const rawF = (r.fecha_actualizacion as string | null | undefined) ?? null;
  const rawH = (r.hora_actualizacion as string | null | undefined) ?? null;
  const fa = rawF != null && String(rawF).trim() !== '' ? String(rawF).trim() : null;
  const ha = rawH != null && String(rawH).trim() !== '' ? String(rawH).trim() : null;
  return {
    id: p.id != null ? String(p.id) : undefined,
    estacion_id: p.estacion_id != null ? String(p.estacion_id) : undefined,
    label: p.label ?? null,
    subtitulo: p.subtitulo ?? null,
    precio: p.precio ?? null,
    fecha_actualizacion: fa,
    hora_actualizacion: ha,
  };
}

export default function Precios() {
  const [estaciones, setEstaciones] = useState<EstacionRow[]>([]);
  const [sincronizandoPrecios, setSincronizandoPrecios] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  /** Falló solo `precios_combustible`; dejamos filas de estación para mostrar tarjetas con precios `--`. */
  const [advertenciaPrecios, setAdvertenciaPrecios] = useState<string | null>(null);

  const tableroUltimaActualizacion = useMemo(() => {
    const todas: PrecioCombustibleRow[] = [];
    for (const e of estaciones) {
      todas.push(...listPrecios(e.precios_combustible));
    }
    return lineaUltimaActualizacion(todas);
  }, [estaciones]);

  /** Siempre dos tarjetas: reales o placeholders para no colapsar el layout. */
  const estacionesVisibles = useMemo(() => {
    if (sincronizandoPrecios) return PLACEHOLDER_ESTACIONES;
    if (estaciones.length > 0) return estaciones;
    return PLACEHOLDER_ESTACIONES;
  }, [sincronizandoPrecios, estaciones]);

  const avisoDiscreto = useMemo(() => {
    if (sincronizandoPrecios) return 'Actualizando precios...';
    if (errorCarga || advertenciaPrecios) return 'Sin conexión temporal';
    return null;
  }, [sincronizandoPrecios, errorCarga, advertenciaPrecios]);

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
        .select('id,estacion_id,label,subtitulo,precio,fecha_actualizacion,hora_actualizacion')
        .in('estacion_id', ids)
        .order('label', { ascending: true });

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
    const esPlaceholder = (row: EstacionRow) => row.id.startsWith('__placeholder');
    const mostrarPulsoCarga = sincronizandoPrecios;

    return estacionesVisibles.map((row, index) => {
      const tema = resolveTemaVisual(row, index);
      const ui = TEMA_UI[tema];
      const filas = mergeEstacionPrecios(row);
      const placeholderFila = esPlaceholder(row);
      const precios = filas.map((r, i) => ({
        rowKey: r.id ?? `${row.id}-${i}-${r.label ?? i}`,
        label: String(r.label ?? ''),
        subtitulo: r.subtitulo?.trim() ? String(r.subtitulo) : '--',
        color: colorForLabel(r.label),
        precio: formatPrecioDisplay(r.precio),
        mostrarEsqueleto: mostrarPulsoCarga,
      }));
      let vigenciaPrincipal: string;
      if (placeholderFila || errorCarga || advertenciaPrecios) {
        vigenciaPrincipal = lineaUltimaActualizacion([]);
      } else {
        vigenciaPrincipal = lineaUltimaActualizacion(listPrecios(row.precios_combustible));
      }
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
        vigenciaPrincipal,
        tituloEsqueleto: mostrarPulsoCarga,
        logoEsqueleto: mostrarPulsoCarga,
      };
    });
  }, [estacionesVisibles, sincronizandoPrecios, errorCarga, advertenciaPrecios]);

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

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="mb-4 flex min-h-[1.25rem] items-center justify-center">
          {avisoDiscreto ? (
            <p
              className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500"
              role="status"
              aria-live="polite"
            >
              {avisoDiscreto}
            </p>
          ) : null}
        </div>
        <div className="grid lg:grid-cols-2 gap-10">
          {tarjetas.map(({ key: stationKey, ...card }) => (
            <EstacionCard key={stationKey} {...card} />
          ))}
        </div>
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
              {tableroUltimaActualizacion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
