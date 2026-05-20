'use client';

import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import PinPad from '@/components/admin-precios/PinPad';
import AdminPreciosPanel from '@/components/admin-precios/AdminPreciosPanel';

export default function AdminPreciosPage() {
  const [pin, setPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSession, setPinSession] = useState('');

  const verificarPin = async (codigo: string) => {
    setVerificando(true);
    setPinError(null);
    try {
      const res = await fetch('/api/admin-precios/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: codigo }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setPinError('PIN incorrecto. Intenta de nuevo.');
        setPin('');
        return;
      }
      setPinSession(codigo);
      setIsAuthorized(true);
      setPin('');
    } catch {
      setPinError('No se pudo verificar el acceso.');
      setPin('');
    } finally {
      setVerificando(false);
    }
  };

  const salir = () => {
    setIsAuthorized(false);
    setPinSession('');
    setPin('');
    setPinError(null);
  };

  if (isAuthorized) {
    return <AdminPreciosPanel pin={pinSession} onLogout={salir} />;
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gray-200 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 bg-white">
          <div className="bg-gray-950 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E30613]/20 border border-[#E30613]/50 mb-4">
              <Shield className="w-7 h-7 text-[#E30613]" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black mb-2">
              Acceso restringido
            </p>
            <h1 className="text-2xl sm:text-3xl font-black italic uppercase text-white tracking-tight">
              Panel de <span className="text-[#E30613]">Precios</span>
            </h1>
          </div>

          <div className="px-6 py-8 sm:py-10">
            <p className="text-gray-500 text-sm text-center mb-8">
              Ingresa tu PIN de 4 dígitos. En escritorio también puedes usar el teclado.
            </p>

            <PinPad
              value={pin}
              onChange={setPin}
              onComplete={verificarPin}
              disabled={verificando}
              error={pinError}
            />

            {verificando ? (
              <p className="text-gray-400 text-xs mt-6 text-center animate-pulse">Verificando…</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
