'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fuelKindFromParts } from '@/lib/fuelLabelKind';
import type { AdminEstacionGroup, AdminPrecioRow } from '@/lib/adminPreciosData';
import type { ModoCapturaPrecios } from '@/lib/preciosModoCaptura';
import { validatePrecioInput } from '@/lib/adminPreciosValidation';
import { CheckCircle2, Loader2, RefreshCw, Save } from 'lucide-react';

type AdminPreciosPanelProps = {
  pin: string;
  onLogout: () => void;
};

type PrecioFormState = Record<string, string>;

function colorForFuel(label: string, subtitulo: string | null): string {
  const k = fuelKindFromParts(label, subtitulo);
  if (k === 'magna') return 'text-green-400';
  if (k === 'premium') return 'text-[#FF0000]';
  if (k === 'diesel') return 'text-gray-300';
  return 'text-white';
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
    <div className="min-h-screen bg-gray-950 text-white pb-28 lg:pb-12">
      {toast ? (
        <div
          className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl bg-white text-gray-900 px-5 py-4 shadow-2xl border-l-4 border-[#FF0000] flex items-center gap-3"
          role="status"
        >
          <CheckCircle2 className="w-6 h-6 text-[#FF0000] shrink-0" />
          <span className="font-bold text-sm sm:text-base">{toast}</span>
        </div>
      ) : null}

      <header className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#FF0000] font-black">
              Panel interno
            </p>
            <h1 className="text-xl sm:text-2xl font-black italic uppercase tracking-tight">
              Captura de <span className="text-[#FF0000]">Precios</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => cargarDatos()}
              disabled={cargando}
              className="p-2.5 rounded-xl border border-white/15 hover:border-[#FF0000] transition-colors disabled:opacity-50"
              aria-label="Recargar"
            >
              <RefreshCw className={`w-5 h-5 ${cargando ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {avisoConfig ? (
          <div
            className="rounded-xl bg-amber-500/15 border border-amber-500/50 text-amber-100 px-4 py-3 text-sm leading-relaxed"
            role="status"
          >
            <p className="font-black uppercase tracking-wide text-amber-400 text-xs mb-1">
              Configuración pendiente en Supabase
            </p>
            <p>{avisoConfig}</p>
            <p className="mt-2 text-xs text-amber-200/80">
              Archivo: <code className="text-white">supabase/setup-admin-precios.sql</code> → pégalo en SQL
              Editor → Run. Luego recarga esta página.
            </p>
          </div>
        ) : null}

        {errorGlobal ? (
          <p className="rounded-xl bg-[#FF0000]/15 border border-[#FF0000]/40 text-[#FF0000] px-4 py-3 text-sm font-bold">
            {errorGlobal}
          </p>
        ) : null}

        {/* Switch modo */}
        <section className="rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900 to-black p-5 sm:p-8 shadow-xl">
          <p className="text-center text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-4">
            Modo de operación
          </p>
          <div className="flex flex-col sm:flex-row max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/15">
            <button
              type="button"
              disabled={cambiandoModo || tablaConfigFaltante}
              onClick={() => modo !== 'automatico' && cambiarModo('automatico')}
              className={`flex-1 py-4 px-4 text-xs sm:text-sm font-black uppercase tracking-wide transition-all ${
                modo === 'automatico'
                  ? 'bg-[#FF0000] text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
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
              className={`flex-1 py-4 px-4 text-xs sm:text-sm font-black uppercase tracking-wide transition-all border-t sm:border-t-0 sm:border-l border-white/10 ${
                modo === 'manual'
                  ? 'bg-[#FF0000] text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              } disabled:opacity-60`}
            >
              Modo Manual
              <span className="block text-[10px] font-medium normal-case tracking-normal mt-1 opacity-90">
                Edición libre
              </span>
            </button>
          </div>
          {cambiandoModo ? (
            <p className="text-center text-gray-500 text-xs mt-3 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Actualizando modo…
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
            <Loader2 className="w-10 h-10 animate-spin text-[#FF0000]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {estaciones.map((est) => (
              <article
                key={est.id}
                className="rounded-2xl sm:rounded-3xl border border-white/10 bg-gray-900/80 p-5 sm:p-7 shadow-lg"
              >
                <header className="mb-6 pb-4 border-b border-white/10">
                  <h2 className="text-lg sm:text-xl font-black italic uppercase text-white">
                    {estacionTitulo(est.nombre)}
                  </h2>
                  {est.marca ? (
                    <p className="text-[11px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wide">
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
                            <span className="block text-[11px] text-gray-500 uppercase tracking-wider mt-0.5">
                              {p.subtitulo}
                            </span>
                          ) : null}
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-gray-500 font-black text-lg">$</span>
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
                              className={`flex-1 rounded-xl bg-black/50 border-2 px-4 py-3 text-lg sm:text-xl font-black text-white outline-none transition-all ${
                                err
                                  ? 'border-[#FF0000] ring-2 ring-[#FF0000]/30'
                                  : 'border-white/15 focus:border-[#FF0000]'
                              } disabled:opacity-45 disabled:cursor-not-allowed`}
                            />
                          </div>
                          {err ? (
                            <p className="text-[#FF0000] text-xs font-bold mt-1">{err}</p>
                          ) : null}
                        </label>
                      </li>
                    );
                  })}
                </ul>

                {est.precios[0]?.fecha_actualizacion ? (
                  <p className="text-[10px] text-gray-600 mt-6 uppercase tracking-wide">
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
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:static lg:mt-0 p-4 lg:p-0 lg:max-w-7xl lg:mx-auto lg:px-4 lg:pb-10 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent lg:bg-none border-t border-white/10 lg:border-0">
        <button
          type="button"
          onClick={guardar}
          disabled={!manual || guardando || cargando}
          className="w-full lg:max-w-md lg:mx-auto flex items-center justify-center gap-3 rounded-2xl bg-[#FF0000] hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black uppercase tracking-[0.2em] py-4 sm:py-5 shadow-xl shadow-red-600/25 transition-all active:scale-[0.98]"
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
