'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fuelKindFromParts } from '@/lib/fuelLabelKind';
import type { AdminEstacionGroup, AdminPrecioRow } from '@/lib/adminPreciosData';
import type { ModoCapturaPrecios } from '@/lib/preciosModoCaptura';
import { validatePrecioInput } from '@/lib/adminPreciosValidation';
import { CheckCircle2, Eye, Loader2, RefreshCw, Save } from 'lucide-react';

type AdminPreciosPanelProps = {
  pin: string;
  onLogout: () => void;
};

type PrecioFormState = Record<string, string>;

function colorForFuel(label: string, subtitulo: string | null): string {
  const k = fuelKindFromParts(label, subtitulo);
  if (k === 'magna') return 'text-green-600';
  if (k === 'premium') return 'text-[#E30613]';
  if (k === 'diesel') return 'text-gray-900';
  return 'text-gray-900';
}

function estacionTitulo(nombre: string): string {
  if (/santa\s*irene|gsi/i.test(nombre)) return 'Santa Irene (GSI)';
  if (/pozole|gpo/i.test(nombre)) return 'El Pozole (GPO)';
  return nombre;
}

export default function AdminPreciosPanel({ pin, onLogout }: AdminPreciosPanelProps) {
  const [modo, setModo] = useState<ModoCapturaPrecios>('automatico');
  const [estaciones, setEstaciones] = useState<AdminEstacionGroup[]>([]);
  const [valores, setValores] = useState<PrecioFormState>({});
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [cambiandoModo, setCambiandoModo] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const [avisoConfig, setAvisoConfig] = useState<string | null>(null);
  const [tablaConfigFaltante, setTablaConfigFaltante] = useState(false);
  const [visitasTotal, setVisitasTotal] = useState<number | null>(null);
  const [visitasActualizando, setVisitasActualizando] = useState(false);

  const manual = modo === 'manual';

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setErrorGlobal(null);
    try {
      const res = await fetch('/api/admin-precios/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? 'No se pudieron cargar los datos.');
      }
      setModo(json.modo === 'manual' ? 'manual' : 'automatico');
      setTablaConfigFaltante(Boolean(json.tablaConfigFaltante));
      setAvisoConfig(typeof json.aviso === 'string' ? json.aviso : null);
      setEstaciones(json.estaciones ?? []);
      setVisitasTotal(typeof json.visitasTotal === 'number' ? json.visitasTotal : 0);
      const next: PrecioFormState = {};
      for (const est of json.estaciones ?? []) {
        for (const p of est.precios as AdminPrecioRow[]) {
          next[p.id] =
            p.precio != null && Number.isFinite(p.precio) ? String(Number(p.precio).toFixed(2)) : '';
        }
      }
      setValores(next);
      setErrores({});
    } catch (e) {
      setErrorGlobal(e instanceof Error ? e.message : String(e));
    } finally {
      setCargando(false);
    }
  }, [pin]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const actualizarVisitas = useCallback(async () => {
    setVisitasActualizando(true);
    try {
      const res = await fetch('/api/admin-precios/visitas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const json = await res.json();
      if (res.ok && json.ok && typeof json.total === 'number') {
        setVisitasTotal(json.total);
      }
    } catch {
      /* silencioso: el polling no debe interrumpir el panel */
    } finally {
      setVisitasActualizando(false);
    }
  }, [pin]);

  useEffect(() => {
    if (!pin) return;
    const interval = window.setInterval(() => {
      void actualizarVisitas();
    }, 15000);
    return () => window.clearInterval(interval);
  }, [pin, actualizarVisitas]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const todasLasFilas = useMemo(
    () => estaciones.flatMap((e) => e.precios.map((p) => ({ ...p, estacionNombre: e.nombre }))),
    [estaciones]
  );

  const cambiarModo = async (next: ModoCapturaPrecios) => {
    setCambiandoModo(true);
    setErrorGlobal(null);
    try {
      const res = await fetch('/api/admin-precios/modo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin,
          modo: next,
          sincronizar: next === 'automatico',
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? 'No se pudo cambiar el modo.');
      }
      setModo(json.modo === 'manual' ? 'manual' : 'automatico');
      if (next === 'automatico') {
        setToast('Modo automático activo. Sincronización CRE ejecutada.');
        await cargarDatos();
      } else {
        setToast('Modo manual: puedes editar precios.');
      }
    } catch (e) {
      setErrorGlobal(e instanceof Error ? e.message : String(e));
    } finally {
      setCambiandoModo(false);
    }
  };

  const validarTodo = (): boolean => {
    const nextErr: Record<string, string> = {};
    for (const row of todasLasFilas) {
      const v = valores[row.id] ?? '';
      const msg = validatePrecioInput(v);
      if (msg) nextErr[row.id] = msg;
    }
    setErrores(nextErr);
    return Object.keys(nextErr).length === 0;
  };

  const guardar = async () => {
    if (!manual) {
      setErrorGlobal('Activa Modo Manual para guardar cambios.');
      return;
    }
    if (!validarTodo()) return;

    setGuardando(true);
    setErrorGlobal(null);
    try {
      const updates = todasLasFilas.map((r) => ({
        id: r.id,
        precio: valores[r.id],
      }));
      const res = await fetch('/api/admin-precios/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, updates }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        if (json.errores) setErrores(json.errores);
        const detalle =
          json.errores && typeof json.errores === 'object'
            ? Object.values(json.errores).slice(0, 2).join(' · ')
            : '';
        throw new Error(
          [json.error ?? 'Error al guardar.', detalle].filter(Boolean).join(' ')
        );
      }
      setToast(
        json.actualizados
          ? `¡${json.actualizados} precio(s) guardados en Supabase! ✅`
          : '¡Precios actualizados! ✅'
      );
      await cargarDatos();
    } catch (e) {
      setErrorGlobal(e instanceof Error ? e.message : String(e));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 text-gray-900 pb-28 lg:pb-12">
      {toast ? (
        <div
          className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl bg-white text-gray-900 px-5 py-4 shadow-2xl border-l-4 border-[#E30613] flex items-center gap-3"
          role="status"
        >
          <CheckCircle2 className="w-6 h-6 text-[#E30613] shrink-0" />
          <span className="font-bold text-sm sm:text-base">{toast}</span>
        </div>
      ) : null}

      <header className="bg-gray-950 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#E30613] font-black">
              Panel interno
            </p>
            <h1 className="text-xl sm:text-2xl font-black italic uppercase tracking-tight text-white">
              Captura de <span className="text-[#E30613]">Precios</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => cargarDatos()}
              disabled={cargando}
              className="p-2.5 rounded-xl border border-white/20 hover:border-[#E30613] hover:bg-white/5 transition-colors disabled:opacity-50 text-white"
              aria-label="Recargar"
            >
              <RefreshCw className={`w-5 h-5 ${cargando ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border border-white/25 hover:bg-white/10 text-white"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {avisoConfig ? (
          <div
            className="rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 px-4 py-3 text-sm leading-relaxed shadow-sm"
            role="status"
          >
            <p className="font-black uppercase tracking-wide text-amber-700 text-xs mb-1">
              Configuración pendiente en Supabase
            </p>
            <p>{avisoConfig}</p>
            <p className="mt-2 text-xs text-amber-800/80">
              Archivo: <code className="bg-white px-1 rounded">supabase/setup-admin-precios.sql</code> → pégalo en SQL
              Editor → Run. Luego recarga esta página.
            </p>
          </div>
        ) : null}

        {errorGlobal ? (
          <p className="rounded-2xl bg-red-50 border border-red-200 text-[#E30613] px-4 py-3 text-sm font-bold shadow-sm">
            {errorGlobal}
          </p>
        ) : null}

        <section className="rounded-2xl sm:rounded-[2rem] border border-gray-100 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-5 sm:p-6 shadow-xl overflow-hidden relative">
          <div
            className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-[#E30613]/20 blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E30613]/15 border border-[#E30613]/30 flex items-center justify-center shrink-0">
                <Eye className="w-6 h-6 text-[#E30613]" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.28em] text-gray-400">
                  Analítica del sitio
                </p>
                <h2 className="text-lg sm:text-xl font-black italic uppercase text-white tracking-tight">
                  Visitas <span className="text-[#E30613]">totales</span>
                </h2>
              </div>
            </div>
            <div className="flex items-end justify-between sm:justify-end gap-4 sm:gap-6">
              <div className="text-left sm:text-right">
                <p className="text-4xl sm:text-5xl font-black tabular-nums text-white leading-none tracking-tighter">
                  {visitasTotal == null ? '—' : visitasTotal.toLocaleString('es-MX')}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">
                  Sesiones públicas únicas
                </p>
              </div>
              <button
                type="button"
                onClick={() => void actualizarVisitas()}
                disabled={visitasActualizando}
                className="p-2.5 rounded-xl border border-white/15 text-white hover:border-[#E30613] hover:bg-white/5 transition-colors disabled:opacity-50"
                aria-label="Actualizar visitas"
              >
                <RefreshCw className={`w-4 h-4 ${visitasActualizando ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <p className="relative mt-4 text-[11px] text-gray-500 leading-snug border-t border-white/10 pt-3">
            Actualización automática cada 15 s. No cuenta rutas de administración ni visitas repetidas en la misma
            sesión del navegador.
          </p>
        </section>

        {/* Switch modo */}
        <section className="rounded-2xl sm:rounded-[2rem] border border-gray-100 bg-white p-5 sm:p-8 shadow-xl">
          <p className="text-center text-gray-500 text-xs sm:text-sm font-bold uppercase tracking-widest mb-4">
            Modo de operación
          </p>
          <div className="flex flex-col sm:flex-row max-w-2xl mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-gray-100 p-1 gap-1 sm:gap-0 sm:p-1">
            <button
              type="button"
              disabled={cambiandoModo || tablaConfigFaltante}
              onClick={() => modo !== 'automatico' && cambiarModo('automatico')}
              className={`flex-1 py-4 px-4 rounded-xl sm:rounded-l-xl sm:rounded-r-none text-xs sm:text-sm font-black uppercase tracking-wide transition-all ${
                modo === 'automatico'
                  ? 'bg-[#E30613] text-white shadow-md'
                  : 'bg-transparent text-gray-500 hover:text-gray-900'
              } disabled:opacity-60`}
            >
              Modo Automático
              <span className="block text-[10px] font-medium normal-case tracking-normal mt-1 opacity-90">
                Sincronizado CRE
              </span>
            </button>
            <button
              type="button"
              disabled={cambiandoModo || tablaConfigFaltante}
              onClick={() => modo !== 'manual' && cambiarModo('manual')}
              className={`flex-1 py-4 px-4 rounded-xl sm:rounded-r-xl sm:rounded-l-none text-xs sm:text-sm font-black uppercase tracking-wide transition-all ${
                modo === 'manual'
                  ? 'bg-[#E30613] text-white shadow-md'
                  : 'bg-transparent text-gray-500 hover:text-gray-900'
              } disabled:opacity-60`}
            >
              Modo Manual
              <span className="block text-[10px] font-medium normal-case tracking-normal mt-1 opacity-90">
                Edición libre
              </span>
            </button>
          </div>
          {cambiandoModo ? (
            <p className="text-center text-gray-400 text-xs mt-3 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#E30613]" /> Actualizando modo…
            </p>
          ) : (
            <p className="text-center text-gray-500 text-xs mt-3">
              {manual
                ? 'Los campos están habilitados. El cron no sobrescribirá precios hasta volver a automático.'
                : 'Precios bloqueados: se actualizan desde el portal CRE (cron diario).'}
            </p>
          )}
        </section>

        {cargando ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#E30613]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {estaciones.map((est) => (
              <article
                key={est.id}
                className="rounded-2xl sm:rounded-[2rem] border border-gray-100 bg-white p-5 sm:p-7 shadow-xl"
              >
                <header className="mb-6 pb-4 border-b border-gray-100">
                  <h2 className="text-lg sm:text-xl font-black italic uppercase text-gray-900">
                    {estacionTitulo(est.nombre)}
                  </h2>
                  {est.marca ? (
                    <p className="text-[11px] sm:text-xs text-[#E30613] mt-1 uppercase tracking-wide font-bold">
                      {est.marca}
                    </p>
                  ) : null}
                </header>

                <ul className="space-y-5">
                  {est.precios.map((p) => {
                    const err = errores[p.id];
                    const fuelColor = colorForFuel(p.label, p.subtitulo);
                    return (
                      <li key={p.id}>
                        <label className="block">
                          <span className={`text-sm sm:text-base font-black italic uppercase ${fuelColor}`}>
                            {p.label}
                          </span>
                          {p.subtitulo ? (
                            <span className="block text-[11px] text-gray-400 uppercase tracking-wider mt-0.5">
                              {p.subtitulo}
                            </span>
                          ) : null}
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-gray-400 font-black text-lg">$</span>
                            <input
                              type="number"
                              inputMode="decimal"
                              step="0.01"
                              min={10}
                              max={50}
                              disabled={!manual || guardando}
                              value={valores[p.id] ?? ''}
                              onChange={(e) => {
                                const v = e.target.value;
                                setValores((prev) => ({ ...prev, [p.id]: v }));
                                const msg = v.trim() === '' ? 'Campo vacío' : validatePrecioInput(v);
                                setErrores((prev) => {
                                  const next = { ...prev };
                                  if (msg) next[p.id] = msg;
                                  else delete next[p.id];
                                  return next;
                                });
                              }}
                              className={`flex-1 rounded-xl bg-gray-50 border-2 px-4 py-3 text-lg sm:text-xl font-black text-gray-900 outline-none transition-all ${
                                err
                                  ? 'border-[#E30613] ring-2 ring-[#E30613]/20'
                                  : 'border-gray-200 focus:border-[#E30613] focus:bg-white'
                              } disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                            />
                          </div>
                          {err ? (
                            <p className="text-[#E30613] text-xs font-bold mt-1">{err}</p>
                          ) : null}
                        </label>
                      </li>
                    );
                  })}
                </ul>

                {est.precios[0]?.fecha_actualizacion ? (
                  <p className="text-[10px] text-gray-400 mt-6 uppercase tracking-wide border-t border-gray-100 pt-4">
                    Última vigencia: {est.precios[0].fecha_actualizacion} ·{' '}
                    {est.precios[0].hora_actualizacion ?? '--'}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Guardar: fijo en móvil */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:static lg:mt-0 p-4 lg:p-0 lg:max-w-7xl lg:mx-auto lg:px-4 lg:pb-10 bg-gradient-to-t from-gray-200 via-gray-200/95 to-transparent lg:bg-none border-t border-gray-200 lg:border-0">
        <button
          type="button"
          onClick={guardar}
          disabled={!manual || guardando || cargando}
          className="w-full lg:max-w-md lg:mx-auto flex items-center justify-center gap-3 rounded-2xl bg-[#E30613] hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black uppercase tracking-[0.2em] py-4 sm:py-5 shadow-xl shadow-red-500/20 transition-all active:scale-[0.98]"
        >
          {guardando ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {guardando ? 'Guardando…' : 'Guardar precios'}
        </button>
      </div>
    </div>
  );
}
