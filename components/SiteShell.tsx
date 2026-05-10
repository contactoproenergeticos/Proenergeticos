'use client';

import React from 'react';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import Header from '@/components/Header';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-200 font-sans overflow-x-hidden">
      {/* 1. NAVEGACIÓN FIJA (Sticky) */}
      <div className="sticky top-0 z-50 w-full shadow-md">
        <Header />
      </div>

      <main className="flex-grow pt-4 px-4 md:px-0 w-full max-w-screen-2xl mx-auto">
        {children}
      </main>

      <footer className="bg-[#080808] text-white py-12 md:py-16 px-6 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto">
          {/* Grid principal responsivo */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8 mb-16">
            
            {/* 1. MÉTODOS DE PAGO (Proporción ajustada para móviles) */}
            <div className="w-full lg:w-[280px] space-y-4">
              <p className="text-gray-300 text-[12px] italic font-medium leading-tight max-w-[260px]">
                Carga combustible y paga de diferentes formas, aceptamos todas las tarjetas y diversos monederos.
              </p>
              {/* h-20 en móvil, h-32 en desktop para que no se vea gigante */}
              <div className="relative w-full h-20 lg:h-32">
                <Image 
                  src="/images/pagos/pago tarjetas credito.png" 
                  alt="Métodos de Pago" 
                  fill 
                  className="object-contain object-left md:object-center lg:object-left"
                  priority
                />
              </div>
            </div>

            {/* 2. BLOQUE CENTRAL: Reorganizado para móviles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row flex-grow justify-around items-start gap-10 lg:gap-4 w-full">
              
              {/* SERVICIOS */}
              <div className="min-w-[140px]">
                <h4 className="text-[#E30613] font-black uppercase tracking-widest text-[12px] italic mb-6 border-b border-[#E30613]/30 pb-1">
                  SERVICIOS
                </h4>
                <ul className="space-y-4 text-gray-400 text-[11px] font-bold uppercase italic tracking-tighter">
                  <li><a href="#" className="hover:text-white transition-colors">COMBUSTIBLES</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">ESTACIONES DE SERVICIO</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">VENTAS CORPORATIVAS</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FACTURACIÓN EN LÍNEA</a></li>
                </ul>
              </div>

              {/* NOSOTROS */}
              <div className="min-w-[140px]">
                <h4 className="text-[#E30613] font-black uppercase tracking-widest text-[12px] italic mb-6 border-b border-[#E30613]/30 pb-1">
                  NOSOTROS
                </h4>
                <ul className="space-y-4 text-gray-400 text-[11px] font-bold uppercase italic tracking-tighter">
                  <li><a href="#" className="hover:text-white transition-colors">NUESTRA HISTORIA</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">PRECIOS VIGENTES</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">COMUNIDAD</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">CONTACTO</a></li>
                </ul>
              </div>

              {/* LLÁMANOS (Ocupa ancho completo en móvil si es necesario) */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-1 lg:min-w-[200px]">
                <h4 className="text-[#E30613] font-black uppercase tracking-widest text-[12px] italic mb-6 border-b border-[#E30613]/30 pb-1">
                  LLÁMANOS
                </h4>
                <div className="space-y-5">
                  {[
                    { label: 'PRO-ENERGÉTICOS', tel: '669 991 12 92' },
                    { label: 'GRUPO PRO-ENERGÉTICOS', tel: '669 991 01 01' },
                    { label: 'GASOLINERA SANTA IRENE', tel: '669 990 04 00' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Phone size={14} className="text-[#E30613] fill-[#E30613]" />
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 font-black uppercase italic leading-none mb-1">{item.label}</span>
                        <span className="text-white font-black text-[14px] italic tracking-widest leading-none">{item.tel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. BRANDING (Logos responsivos) */}
            <div className="w-full lg:w-[280px] space-y-6">
              <p className="text-gray-300 text-[12px] leading-tight font-medium italic">
                Líderes en el suministro de combustibles de alta calidad en Mazatlán, Sinaloa. Comprometidos con el servicio litro por litro.
              </p>
              <div className="flex flex-wrap items-center gap-6 lg:gap-4 pt-2">
                <div className="relative w-16 h-14">
                  <Image src="/images/logotipos/ProEner_bco.png" alt="ProEner" fill className="object-contain" />
                </div>
                <div className="relative w-14 h-14">
                  <Image src="/images/logotipos/Logo Grupo.jfif.jpeg" alt="GPO" fill className="object-contain rounded-sm" />
                </div>
                <div className="relative w-24 h-14">
                  <Image src="/images/logotipos/BLAST.png" alt="Blast" fill className="object-contain" />
                </div>
              </div>
            </div>

          </div>

          {/* Barra inferior de certificación responsiva */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left text-[8px] md:text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em] md:tracking-[0.4em]">
            <p>© 2026 PROENERGÉTICOS S.A. DE C.V. — MAZATLÁN, SINALOA</p>
            <p className="text-white/20">NOM-016-CRE-2016 CERTIFICACIÓN VIGENTE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}