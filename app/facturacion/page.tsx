'use client';

import React from 'react';
import Image from 'next/image';
import SiteShell from '@/components/SiteShell';

export default function FacturacionPage() {
  const estaciones = [
    {
      nombre: "SANTA IRENE (GSI)",
      razonSocial: "GASOLINERA SANTA IRENE, S.A. DE C.V.",
      logo: "/images/logotipos/BLAST.png",
      color: "border-[#E30613]",
      // Ajuste específico de tamaño para Blast (más pequeño para equilibrar)
      logoContainerClasses: "h-10 md:h-20 w-full relative mb-4 md:mb-6", 
      link: "https://portal-facturacion-gsi.com" 
    },
    {
      nombre: "EL POZOLE (GPO)",
      razonSocial: "GRUPO PROENERGETICOS OIL COMPANIES S.A. DE C.V.",
      logo: "/images/logotipos/GPO.png",
      color: "border-gray-900",
      // Ajuste específico de tamaño para GPO (ligeramente más grande para equilibrar)
      logoContainerClasses: "h-22 md:h-30 w-full relative mb-4 md:mb-6",
      link: "https://portal-facturacion-gpo.com" 
    }
  ];

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
            {estaciones.map((estacion, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl p-6 md:p-10 border-t-[10px] md:border-t-[16px] ${estacion.color} flex flex-col items-center text-center transition-all duration-500 hover:shadow-2xl h-full`}
              >
                {/* Contenedor de Logo optimizado con clases dinámicas para equilibrio */}
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
                
                {/* Leyenda de Razón Social dinámica */}
                <div className="bg-gray-10 px-3 py-2 rounded-xl md:rounded-full mb-6 md:mb-8 border border-gray-100 w-full min-h-[40px] flex items-center justify-center">
                  <p className="text-gray-500 font-black text-[7px] md:text-[9px] tracking-widest uppercase leading-tight">
                    {estacion.razonSocial}
                  </p>
                </div>

                <a 
                  href={estacion.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#E30613] hover:bg-gray-900 text-white font-black py-4 md:py-5 rounded-xl md:rounded-[2rem] transition-all duration-300 text-[10px] md:text-base shadow-lg shadow-red-500/20 italic uppercase tracking-widest active:scale-95 mt-auto"
                >
                  Acceder al Portal
                </a>

                <p className="mt-4 text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Tenga su ticket a la mano
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center opacity-60">
            <p className="text-gray-400 text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] italic">
              ¿Problemas con su factura? Contacte a soporte técnico de su estación.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}