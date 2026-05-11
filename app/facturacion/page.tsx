'use client';

import React from 'react';
import Image from 'next/image';
import SiteShell from '@/components/SiteShell';

export default function FacturacionPage() {
  const estaciones = [
    {
      nombre: "SANTA IRENE (GSI)",
      logo: "/images/logotipos/BLAST.png",
      color: "border-[#E30613]",
      // Reemplaza con el link real del portal de GSI
      link: "https://portal-facturacion-gsi.com" 
    },
    {
      nombre: "EL POZOLE (GPO)",
      // Usamos el logo de ProEner que tienes para GPO
      logo: "/images/logotipos/ProEner_negro.png", 
      color: "border-gray-900",
      // Reemplaza con el link real del portal de GPO
      link: "https://portal-facturacion-gpo.com" 
    }
  ];

  return (
    <SiteShell>
      <div className="py-20 px-4 bg-gray-100 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 uppercase italic tracking-tighter">
              Facturación <span className="text-[#E30613]">En Línea</span>
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto font-bold text-sm md:text-base uppercase tracking-wide">
              Para garantizar su factura, seleccione la estación donde realizó su carga. 
              Cada unidad cuenta con su propio portal fiscal.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {estaciones.map((estacion, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-[3rem] shadow-2xl p-10 border-t-[16px] ${estacion.color} flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2`}
              >
                {/* Contenedor de Logo optimizado */}
                <div className="h-32 w-full relative mb-8">
                  <Image 
                    src={estacion.logo} 
                    alt={estacion.nombre} 
                    fill 
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 italic uppercase tracking-tighter leading-none">
                  {estacion.nombre}
                </h2>
                
                <div className="bg-gray-50 px-4 py-2 rounded-full mb-8 border border-gray-100">
                  <p className="text-gray-400 font-black text-[10px] tracking-[0.3em] uppercase">
                    Razón Social Independiente
                  </p>
                </div>

                <a 
                  href={estacion.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#E30613] hover:bg-gray-900 text-white font-black py-5 rounded-[2rem] transition-all duration-300 text-sm md:text-base shadow-xl shadow-red-500/20 active:scale-95 italic uppercase tracking-[0.2em]"
                >
                  Acceder al Portal
                </a>

                <p className="mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Tenga su ticket a la mano
                </p>
              </div>
            ))}
          </div>

          {/* Soporte adicional */}
          <div className="mt-20 text-center">
            <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.3em]">
              ¿Problemas con su factura? Contacte a soporte técnico de su estación.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}