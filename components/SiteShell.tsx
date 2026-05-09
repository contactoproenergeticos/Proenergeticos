'use client';

import React from 'react';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import Header from '@/components/Header';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-200 font-sans overflow-x-hidden">
      <Header />

      <main className="flex-grow pt-4 px-4 md:px-0 w-full max-w-screen-2xl mx-auto">
        {children}
      </main>

      <footer className="bg-[#121212] text-white py-16 px-6 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* COLUMNA 1: DESCRIPCIÓN Y LOGOTIPOS LOCALES */}
            <div className="space-y-4">
              <p className="text-gray-400 text-sm leading-relaxed font-medium italic">
                Líderes en el suministro de combustibles de alta calidad en Mazatlán, Sinaloa. Comprometidos con la excelencia y el servicio litro por litro.
              </p>
              
              {/* Contenedor de los 3 logos marcados en tu captura */}
              <div className="flex items-center gap-4 pt-2">
                {/* 1. ProEner_negro.png */}
                <div className="relative w-20 h-20">
                  <Image 
                    src="/images/logotipos/ProEner_bco.png" 
                    alt="ProEnergéticos" 
                    fill 
                    className="object-contain" 
                  />
                </div>
                
                {/* 2. Logo Grupo.jfif.jpeg */}
                <div className="relative w-16 h-16">
                  <Image 
                    src="/images/logotipos/Logo Grupo.jfif.jpeg" 
                    alt="Grupo ProEnergéticos" 
                    fill 
                    className="object-contain" 
                  />
                </div>

                {/* 3. BLAST.png */}
                <div className="relative w-24 h-12">
                  <Image 
                    src="/images/logotipos/BLAST.png" 
                    alt="Blast Gasoline" 
                    fill 
                    className="object-contain" 
                  />
                </div>
              </div>
            </div>

            {/* COLUMNA 2: SERVICIOS */}
            <div>
              <h4 className="text-[#E30613] font-black uppercase tracking-widest text-sm mb-8 italic">Servicios</h4>
              <ul className="space-y-4 text-gray-400 text-[13px] font-bold uppercase italic tracking-tighter">
                <li><a href="/servicios" className="hover:text-white transition-colors">Combustibles</a></li>
                <li><a href="/estaciones" className="hover:text-white transition-colors">Estaciones de Servicio</a></li>
                <li><a href="/servicios" className="hover:text-white transition-colors">Ventas Corporativas</a></li>
                <li>
                  <a 
                    href="https://facturacion.proenergeticos.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-white transition-colors"
                  >
                    Facturación en Línea
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMNA 3: NOSOTROS */}
            <div>
              <h4 className="text-[#E30613] font-black uppercase tracking-widest text-sm mb-8 italic">Nosotros</h4>
              <ul className="space-y-4 text-gray-400 text-[13px] font-bold uppercase italic tracking-tighter">
                <li><a href="/nosotros" className="hover:text-white transition-colors">Nuestra Historia</a></li>
                <li><a href="/servicios" className="hover:text-white transition-colors">Precios Vigentes</a></li>
                <li><a href="/servicios" className="hover:text-white transition-colors">Comunidad</a></li>
                <li><a href="/contacto" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>

            {/* COLUMNA 4: CONTACTO MULTILÍNEA */}
            <div className="space-y-6">
              <h4 className="text-[#E30613] font-black uppercase tracking-widest text-sm mb-6 italic">Llámanos</h4>
              
              <div className="space-y-4">
                {/* Pro-Energéticos */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#E30613] mt-1" fill="#E30613" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-black uppercase italic">Pro-Energéticos</span>
                    <span className="text-white font-black text-sm italic tracking-wide">669 991 12 92</span>
                  </div>
                </div>

                {/* Grupo Pro-Energéticos */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#E30613] mt-1" fill="#E30613" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-black uppercase italic">Grupo Pro-Energéticos</span>
                    <span className="text-white font-black text-sm italic tracking-wide">669 991 01 01</span>
                  </div>
                </div>

                {/* Gasolinera Santa Irene */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#E30613] mt-1" fill="#E30613" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-black uppercase italic">Gasolinera Santa Irene</span>
                    <span className="text-white font-black text-sm italic tracking-wide">669 990 04 00</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* BARRA INFERIOR (FOOTER BOTTOM) */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">
            <p>© 2026 PROENERGÉTICOS S.A. DE C.V. — MAZATLÁN, SINALOA</p>
            <p>CUMPLIMIENTO NOM-016-CRE-2016</p>
          </div>
        </div>
      </footer>
    </div>
  );
}