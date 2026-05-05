'use client';

import React from 'react';
import SiteShell from '@/components/SiteShell'; // <--- ESTO ES LA CLAVE

export default function FacturacionPage() {
  const estaciones = [
    {
      nombre: "SANTA IRENE (GSI)",
      logo: "/images/logotipos/BLAST.png",
      color: "border-yellow-500",
      link: "#" 
    },
    {
      nombre: "EL POZOLE (GPO)",
      logo: "/images/logotipos/PEMEX.png",
      color: "border-green-700",
      link: "#" 
    }
  ];

  return (
    <SiteShell> {/* <--- ENVOLVEMOS TODO AQUÍ */}
      <div className="py-20 px-4 bg-gray-100 min-h-[70vh]">
        <h1 className="text-4xl font-black text-center text-gray-900 mb-4 uppercase italic">
          Facturación en Línea
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto font-medium">
          Seleccione la estación donde realizó su carga para acceder al portal correspondiente.
        </p>
        
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {estaciones.map((estacion, index) => (
            <div key={index} className={`bg-white rounded-[2.5rem] shadow-xl p-10 border-t-[12px] ${estacion.color} flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300`}>
              <div className="h-24 flex items-center justify-center mb-8">
                <img src={estacion.logo} alt={estacion.nombre} className="max-h-full object-contain" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2 italic uppercase tracking-tight">
                {estacion.nombre}
              </h2>
              <p className="text-gray-400 mb-8 font-bold text-xs tracking-[0.2em] uppercase">
                Estación de Servicio
              </p>
              <a 
                href={estacion.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#E30613] hover:bg-gray-900 text-white font-black py-4 rounded-2xl transition-all duration-300 text-xl shadow-lg active:scale-95 italic uppercase tracking-widest"
              >
                Facturar Aquí
              </a>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}