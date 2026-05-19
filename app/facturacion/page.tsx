'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import SiteShell from '@/components/SiteShell';
import { supabase } from '@/lib/supabase';

type ClaveEstacion = 'GSI' | 'GPO';

type EstacionFacturacion = {
  clave: ClaveEstacion;
  nombre: string;
  razonSocial: string;
  logo: string;
  color: string;
  logoContainerClasses: string;
};

const ESTACIONES: EstacionFacturacion[] = [
  {
    clave: 'GSI',
    nombre: 'SANTA IRENE (GSI)',
    razonSocial: 'GASOLINERA SANTA IRENE, S.A. DE C.V.',
    logo: '/images/logotipos/BLAST.png',
    color: 'border-[#E30613]',
    logoContainerClasses: 'h-10 md:h-20 w-full relative mb-4 md:mb-6',
  },
  {
    clave: 'GPO',
    nombre: 'EL POZOLE (GPO)',
    razonSocial: 'GRUPO PROENERGETICOS OIL COMPANIES S.A. DE C.V.',
    logo: '/images/logotipos/GPO.png',
    color: 'border-gray-900',
    logoContainerClasses: 'h-22 md:h-30 w-full relative mb-4 md:mb-6',
  },
];

/**
 * Normaliza la URL guardada en Supabase. Si no incluye protocolo,
 * se le antepone `https://` para evitar enlaces relativos al portal interno.
 */
function normalizarUrl(valor: unknown): string | null {
  if (typeof valor !== 'string') return null;
  const limpio = valor.trim();
  if (!limpio) return null;
  if (/^https?:\/\//i.test(limpio)) return limpio;
  return `https://${limpio}`;
}

/**
 * Busca el valor de la columna sin importar mayúsculas/minúsculas
 * (la tabla está creada con identificadores en mayúscula: "GSI" y "GPO").
 */
function valorPorClave(fila: Record<string, unknown>, clave: ClaveEstacion): string | null {
  const objetivo = clave.toLowerCase();
  for (const [k, v] of Object.entries(fila)) {
    if (k.toLowerCase() === objetivo) return normalizarUrl(v);
  }
  return null;
}

export default function FacturacionPage() {
  const [links, setLinks] = useState<Record<ClaveEstacion, string | null>>({
    GSI: null,
    GPO: null,
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      setError(null);

      const { data, error: errFact } = await supabase
        .from('facturacion')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (errFact) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Facturacion] error:', errFact.message);
        }
        setError(errFact.message);
        setCargando(false);
        return;
      }

      const fila = (data ?? {}) as Record<string, unknown>;
      setLinks({
        GSI: valorPorClave(fila, 'GSI'),
        GPO: valorPorClave(fila, 'GPO'),
      });
      setCargando(false);
    };

    void cargar();
  }, []);

  const tarjetas = useMemo(
    () =>
      ESTACIONES.map((estacion) => ({
        ...estacion,
        link: links[estacion.clave],
      })),
    [links]
  );

  return (
    <SiteShell>
      <div className="py-8 md:py-20 px-4 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h1 className="text-3xl md:text-6xl font-black text-gray-900 mb-3 md:mb-6 uppercase italic tracking-tighter leading-none">
              Facturación <span className="text-[#E30613]">En Línea</span>
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto font-bold text-[10px] md:text-base uppercase tracking-wide px-2 leading-tight">
              Para garantizar su factura, seleccione la estación de su carga.
              Cada unidad cuenta con su propio portal fiscal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-10 items-start">
            {tarjetas.map((estacion) => {
              const portalDisponible = Boolean(estacion.link);
              const botonClases = portalDisponible
                ? 'bg-[#E30613] hover:bg-gray-900 text-white shadow-lg shadow-red-500/20 active:scale-95'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed';

              return (
                <div
                  key={estacion.clave}
                  className={`bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl p-6 md:p-10 border-t-[10px] md:border-t-[16px] ${estacion.color} flex flex-col items-center text-center transition-all duration-500 hover:shadow-2xl h-full`}
                >
                  <div className={estacion.logoContainerClasses}>
                    <Image
                      src={estacion.logo}
                      alt={estacion.nombre}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 150px, 300px"
                    />
                  </div>

                  <h2 className="text-lg md:text-2xl font-black text-gray-900 mb-1 italic uppercase tracking-tighter leading-none">
                    {estacion.nombre}
                  </h2>

                  <div className="bg-gray-10 px-3 py-2 rounded-xl md:rounded-full mb-6 md:mb-8 border border-gray-100 w-full min-h-[40px] flex items-center justify-center">
                    <p className="text-gray-500 font-black text-[7px] md:text-[9px] tracking-widest uppercase leading-tight">
                      {estacion.razonSocial}
                    </p>
                  </div>

                  {portalDisponible ? (
                    <a
                      href={estacion.link as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full font-black py-4 md:py-5 rounded-xl md:rounded-[2rem] transition-all duration-300 text-[10px] md:text-base italic uppercase tracking-widest mt-auto ${botonClases}`}
                    >
                      Acceder al Portal
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className={`w-full font-black py-4 md:py-5 rounded-xl md:rounded-[2rem] transition-all duration-300 text-[10px] md:text-base italic uppercase tracking-widest mt-auto ${botonClases}`}
                    >
                      {cargando ? 'Cargando…' : 'Portal no disponible'}
                    </button>
                  )}

                  <p className="mt-4 text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Tenga su ticket a la mano
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center opacity-60">
            <p className="text-gray-400 text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] italic">
              ¿Problemas con su factura? Contacte a soporte técnico de su estación.
            </p>
          </div>

          {error ? (
            <p
              className="mt-6 text-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400"
              role="status"
              aria-live="polite"
            >
              Conexión temporal con el portal de facturación interrumpida.
            </p>
          ) : null}
        </div>
      </div>
    </SiteShell>
  );
}
