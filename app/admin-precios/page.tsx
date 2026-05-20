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
    <div className="min-h-screen min-h-[100dvh] bg-gray-950 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FF0000]/20 border border-[#FF0000]/40 mb-6">
          <Shield className="w-8 h-8 text-[#FF0000]" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black mb-2">
          Acceso restringido
        </p>
        <h1 className="text-2xl sm:text-3xl font-black italic uppercase text-white tracking-tight">
          Panel de <span className="text-[#FF0000]">Precios</span>
        </h1>
        <p className="text-gray-500 text-sm mt-3 max-w-xs mx-auto">
          Ingresa tu PIN de 4 dígitos. En escritorio también puedes usar el teclado.
        </p>
      </div>

      <PinPad
        value={pin}
        onChange={setPin}
        onComplete={verificarPin}
        disabled={verificando}
        error={pinError}
      />

      {verificando ? (
        <p className="text-gray-500 text-xs mt-6 animate-pulse">Verificando…</p>
      ) : null}
    </div>
  );
}
