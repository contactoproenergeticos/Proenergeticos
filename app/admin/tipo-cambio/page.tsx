'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminTipoCambioPage() {
  const [valorStr, setValorStr] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    setMensaje(null);
    const { data, error: err } = await supabase
      .from('tipo_cambio')
      .select('valor')
      .eq('id', 1)
      .maybeSingle();

    if (err) {
      setError(err.message);
      setValorStr('');
      setCargando(false);
      return;
    }

    if (data != null && data.valor != null && Number.isFinite(Number(data.valor))) {
      setValorStr(String(Number(data.valor)));
    } else {
      setValorStr('');
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  async function guardar() {
    const n = Number(String(valorStr).replace(',', '.'));
    if (!Number.isFinite(n) || n <= 0) {
      setError('Introduce un valor numérico mayor que cero.');
      setMensaje(null);
      return;
    }

    setGuardando(true);
    setError(null);
    setMensaje(null);

    const { error: err } = await supabase.from('tipo_cambio').upsert(
      { id: 1, valor: n, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    );

    setGuardando(false);

    if (err) {
      setError(err.message);
      return;
    }

    setMensaje('Guardado correctamente.');
    void cargar();
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Gestión de Dólar</h1>

        <label htmlFor="tipo-cambio-valor" className="mb-2 block text-sm font-medium text-slate-700">
          Valor actual (MXN por USD)
        </label>
        <input
          id="tipo-cambio-valor"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          disabled={cargando}
          value={valorStr}
          onChange={(e) => setValorStr(e.target.value)}
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:bg-slate-50"
        />

        <button
          type="button"
          onClick={() => void guardar()}
          disabled={cargando || guardando}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {guardando ? 'Guardando…' : 'Guardar'}
        </button>

        {error ? (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        {mensaje ? (
          <p className="mt-4 text-sm text-green-700" role="status">
            {mensaje}
          </p>
        ) : null}
      </div>
    </main>
  );
}
