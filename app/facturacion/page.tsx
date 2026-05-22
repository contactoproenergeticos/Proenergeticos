'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import SiteShell from '@/components/SiteShell';

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
    logoContainerClasses: 'h-8 sm:h-12 md:h-20 w-full relative mb-2 sm:mb-4 md:mb-6',
  },
  {
    clave: 'GPO',
    nombre: 'EL POZOLE (GPO)',
    razonSocial: 'GRUPO PRO-ENERGETICOS OIL COMPANIES S.A. DE C.V.',
    logo: '/images/logotipos/GPO.png',
    color: 'border-gray-900',
    logoContainerClasses: 'h-12 sm:h-16 md:h-30 w-full relative mb-2 sm:mb-4 md:mb-6',
  },
];

type ApiFacturacionOk = { ok: true; GSI?: string | null; GPO?: string | null };
type ApiFacturacionErr = { ok: false; error?: string };
type ApiFacturacion = ApiFacturacionOk | ApiFacturacionErr;

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

      try {
        const res = await fetch('/api/facturacion-links', { cache: 'no-store' });
        const body = (await res.json()) as ApiFacturacion;

        if (!res.ok || !body.ok) {
          const errBody = body as ApiFacturacionErr;
          setError(errBody.error ?? `HTTP ${res.status}`);
          setCargando(false);
          return;
        }

        setLinks({
          GSI: body.GSI ?? null,
          GPO: body.GPO ?? null,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error de red');
      } finally {
        setCargando(false);
      }
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
      <div className="px-3 sm:px-4 bg-gray-100 py-3 sm:py-6 md:py-20 min-h-[60vh]">
        <div className="w-full max-w-4xl mx-auto flex flex-col">
          <div className="text-center mb-3 sm:mb-6 md:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-6xl font-black text-gray-900 mb-1 sm:mb-3 md:mb-6 uppercase italic tracking-tighter leading-none">
              Facturación <span className="text-[#E30613]">En Línea</span>
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto font-bold text-[9px] sm:text-[11px] md:text-base uppercase tracking-wide px-2 leading-tight">
              Para garantizar su factura, seleccione la estación de su carga.
              Cada unidad cuenta con su propio portal fiscal.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-8 lg:gap-10 items-stretch">
            {tarjetas.map((estacion) => {
              const portalDisponible = Boolean(estacion.link);
              const botonClases = portalDisponible
                ? 'bg-[#E30613] hover:bg-gray-900 text-white shadow-lg shadow-red-500/20 active:scale-95'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed';

              return (
                <div
                  key={estacion.clave}
                  className={`bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] shadow-xl p-3 sm:p-5 md:p-10 border-t-[6px] sm:border-t-[10px] md:border-t-[16px] ${estacion.color} flex flex-col items-center text-center transition-all duration-500 hover:shadow-2xl h-full`}
                >
                  <div className={estacion.logoContainerClasses}>
                    <Image
                      src={estacion.logo}
                      alt={estacion.nombre}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 45vw, (max-width: 768px) 220px, 300px"
                    />
                  </div>

                  <h2 className="text-[11px] sm:text-base md:text-2xl font-black text-gray-900 mb-1 italic uppercase tracking-tighter leading-tight">
                    {estacion.nombre}
                  </h2>

                  <div className="hidden sm:flex bg-gray-10 px-3 py-2 rounded-xl md:rounded-full mb-4 md:mb-8 border border-gray-100 w-full min-h-[40px] items-center justify-center">
                    <p className="text-gray-500 font-black text-[7px] md:text-[9px] tracking-widest uppercase leading-tight">
                      {estacion.razonSocial}
                    </p>
                  </div>

                  <p className="sm:hidden text-gray-500 font-black text-[7px] tracking-widest uppercase leading-tight mb-3 px-1">
                    {estacion.razonSocial}
                  </p>

                  {portalDisponible ? (
                    <a
                      href={estacion.link as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full font-black py-2 sm:py-3 md:py-5 rounded-lg sm:rounded-xl md:rounded-[2rem] transition-all duration-300 text-[9px] sm:text-xs md:text-base italic uppercase tracking-widest mt-auto ${botonClases}`}
                    >
                      Acceder al Portal
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className={`w-full font-black py-2 sm:py-3 md:py-5 rounded-lg sm:rounded-xl md:rounded-[2rem] transition-all duration-300 text-[9px] sm:text-xs md:text-base italic uppercase tracking-widest mt-auto ${botonClases}`}
                    >
                      {cargando ? 'Cargando…' : 'No disponible'}
                    </button>
                  )}

                  <p className="mt-2 sm:mt-3 md:mt-4 text-[7px] sm:text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Tenga su ticket a la mano
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-3 sm:mt-6 md:mt-12 text-center opacity-60">
            <p className="text-gray-400 text-[8px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] italic leading-tight">
              ¿Problemas con su factura? Contacte a soporte técnico de su estación.
            </p>
          </div>

          {error ? (
            <p
              className="mt-3 sm:mt-6 text-center text-[9px] md:text-xs font-bold uppercase tracking-widest text-gray-400"
              role="status"
              aria-live="polite"
            >
              {process.env.NODE_ENV === 'development'
                ? `No se pudieron cargar los enlaces: ${error}`
                : 'No se pudieron cargar los enlaces de facturación. Verifique que el despliegue tenga SUPABASE_SERVICE_ROLE_KEY y que la tabla facturacion tenga al menos una fila con las columnas GSI y GPO.'}
            </p>
          ) : null}
        </div>
      </div>
    </SiteShell>
  );
}
