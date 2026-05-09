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

      <footer className="bg-[#080808] text-white py-16 px-6 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto">
          {/* Grid principal con alineación protegida */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-4 mb-16">
            
            {/* 1. MÉTODOS DE PAGO (Usando tu nueva imagen unificada) */}
            <div className="flex-shrink-0 w-full lg:w-[280px] space-y-6">
              <p className="text-gray-300 text-[12px] italic font-medium leading-tight max-w-[260px]">
                Carga combustible y paga de diferentes formas, aceptamos todas las tarjetas y diversos monederos.
              </p>
              <div className="relative w-full h-32">
                <Image 
                  src="/images/pagos/pago tarjetas credito.png" 
                  alt="Métodos de Pago" 
                  fill 
                  className="object-contain object-left"
                  priority
                />
              </div>
            </div>

            {/* BLOQUE CENTRAL: SERVICIOS, NOSOTROS, LLÁMANOS */}
            <div className="flex flex-grow justify-around items-start px-4 lg:px-10 space-x-4">
              
              {/* SERVICIOS */}
              <div className="min-w-[150px]">
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
              <div className="min-w-[150px]">
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

              {/* LLÁMANOS */}
              <div className="min-w-[200px]">
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

            {/* 4. BRANDING (Logos a la derecha) */}
            <div className="flex-shrink-0 w-full lg:w-[280px] space-y-6">
              <p className="text-gray-300 text-[12px] leading-tight font-medium italic">
                Líderes en el suministro de combustibles de alta calidad en Mazatlán, Sinaloa. Comprometidos con el servicio litro por litro.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="relative w-22 h-20">
                  <Image src="/images/logotipos/ProEner_bco.png" alt="ProEner" fill className="object-contain" />
                </div>
                <div className="relative w-20 h-20">
                  <Image src="/images/logotipos/Logo Grupo.jfif.jpeg" alt="GPO" fill className="object-contain rounded-sm" />
                </div>
                <div className="relative w-32 h-20">
                  <Image src="/images/logotipos/BLAST.png" alt="Blast" fill className="object-contain" />
                </div>
              </div>
            </div>

          </div>

          {/* Barra inferior de certificación */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em]">
            <p>© 2026 PROENERGÉTICOS S.A. DE C.V. — MAZATLÁN, SINALOA</p>
            <p className="text-white/20 uppercase">NOM-016-CRE-2016 CERTIFICACIÓN VIGENTE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}