'use client';

import React from 'react';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import Header from '@/components/Header';

/** `tel:` con prefijo +52 para números mostrados con espacios (México). */
function telHrefMexico(display: string): string {
  const digits = display.replace(/\D/g, '');
  if (!digits) return '#';
  return `tel:+52${digits}`;
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-200 font-sans overflow-x-hidden">
      
      {/* 1. NAVEGACIÓN FIJA */}
      <nav className="fixed top-0 left-0 right-0 z-[100] w-full shadow-lg bg-white">
        <Header />
      </nav>

      {/* 2. ESPACIADOR */}
      <main className="flex-grow pt-24 px-4 md:px-0 w-full max-w-screen-2xl mx-auto">
        {children}
      </main>

      <footer className="bg-[#080808] text-white py-12 md:py-16 px-6 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8 mb-16">
            
            {/* MÉTODOS DE PAGO - AJUSTADO PARA VISIBILIDAD MÓVIL */}
            <div className="w-full lg:w-[280px] space-y-4 text-center lg:text-left">
              <p className="text-gray-300 text-[12px] italic font-medium leading-tight max-w-[260px] mx-auto lg:mx-0">
                Carga combustible y paga de diferentes formas, aceptamos todas las tarjetas y diversos monederos.
              </p>
              {/* Se aumentó el alto en móvil (h-24) y se aseguró el ancho completo */}
              <div className="relative w-full h-24 md:h-28 lg:h-32 transition-all">
                <Image 
                  src="/images/pagos/pago tarjetas credito.png" 
                  alt="Métodos de Pago" 
                  fill 
                  className="object-contain lg:object-left"
                  priority
                  sizes="(max-width: 768px) 100vw, 280px"
                />
              </div>
            </div>

            {/* BLOQUE CENTRAL: SERVICIOS, NOSOTROS, LLÁMANOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row flex-grow justify-around items-start gap-10 lg:gap-4 w-full">
              
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

              <div className="min-w-[140px]">
                <h4 className="text-[#E30613] font-black uppercase tracking-widest text-[12px] italic mb-6 border-b border-[#E30613]/30 pb-1">
                  NOSOTROS
                </h4>
                <ul className="space-y-4 text-gray-400 text-[11px] font-bold uppercase italic tracking-tighter">
                  <li><a href="#" className="hover:text-white transition-colors">NUESTRA HISTORIA</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">PRECIOS VIGENTES</a></li>
                  <li><a href="/contacto" className="hover:text-white transition-colors">CONTACTO</a></li>
                </ul>
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-1 lg:min-w-[200px]">
                <h4 className="text-[#E30613] font-black uppercase tracking-widest text-[12px] italic mb-6 border-b border-[#E30613]/30 pb-1">
                  LLÁMANOS
                </h4>
                <div className="space-y-5">
                  {[
                    { label: '', tel: '669 991 12 92' },
                    { label: '', tel: '669 991 01 01' },
                    { label: '', tel: '669 990 04 00' }
                  ].map((item, idx) => (
                    <a
                      key={idx}
                      href={telHrefMexico(item.tel)}
                      className="flex items-center gap-3 rounded-lg py-1 -my-1 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E30613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]"
                      aria-label={`Llamar al ${item.tel}`}
                    >
                      <Phone size={14} className="text-[#E30613] fill-[#E30613] shrink-0" aria-hidden />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] text-gray-500 font-black uppercase italic leading-none mb-1">{item.label}</span>
                        <span className="text-white font-black text-[14px] italic tracking-widest leading-none underline-offset-2 decoration-white/30 hover:underline">
                          {item.tel}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* BRANDING ACTUALIZADO: LOGOS EQUILIBRADOS */}
            <div className="w-full lg:w-[320px] space-y-6 text-center lg:text-left">
              <p className="text-gray-300 text-[12px] leading-tight font-medium italic">
                Líderes en el suministro de combustibles de alta calidad en Mazatlán, Sinaloa. Comprometidos con el servicio litro por litro.
              </p>
              
              <div className="flex flex-row justify-center lg:justify-start items-center gap-6 pt-2">
                {/* ProEner */}
                <div className="relative w-12 h-16 md:w-14 md:h-20">
                  <Image src="/images/logotipos/ProEner_bco.png" alt="ProEner" fill className="object-contain" />
                </div>
                {/* GPO */}
                <div className="relative w-16 h-14 md:w-20 md:h-18">
                  <Image src="/images/logotipos/Logo Grupo.jfif.jpeg" alt="GPO" fill className="object-contain rounded-sm" />
                </div>
                {/* Blast - Ajustado para que no se vea gigante */}
                <div className="relative w-24 h-10 md:w-28 md:h-12">
                  <Image src="/images/logotipos/BLAST.png" alt="Blast" fill className="object-contain" />
                </div>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-center text-[8px] md:text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em] md:tracking-[0.4em]">
            <p>© 2026 GRUPO PROENERGÉTICOS S.A. DE C.V. — MAZATLÁN, SINALOA</p>
            <p className="text-white/20">NOM-016-CRE-2016 CERTIFICACIÓN VIGENTE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}