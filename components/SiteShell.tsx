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
            <div className="space-y-8">
              <p className="text-gray-400 text-sm leading-relaxed font-medium italic">
                Líderes en el suministro de combustibles de alta calidad en Mazatlán, Sinaloa. Comprometidos con la excelencia y el servicio litro por litro.
              </p>
              <Image src="https://i.postimg.cc/4N0XZF3t/PRODUCTOS_FOOTER.png" alt="Pemex" width={260} height={70} className="opacity-90" />
            </div>

            <div>
              <h4 className="text-[#E30613] font-black uppercase tracking-widest text-sm mb-8 italic">Servicios</h4>
              <ul className="space-y-4 text-gray-400 text-[13px] font-bold uppercase italic tracking-tighter">
                <li><a href="/servicios" className="hover:text-white transition-colors">Combustibles Pemex</a></li>
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

            <div>
              <h4 className="text-[#E30613] font-black uppercase tracking-widest text-sm mb-8 italic">Nosotros</h4>
              <ul className="space-y-4 text-gray-400 text-[13px] font-bold uppercase italic tracking-tighter mb-8">
                <li><a href="/nosotros" className="hover:text-white transition-colors">Nuestra Historia</a></li>
                <li><a href="/servicios" className="hover:text-white transition-colors">Precios Vigentes</a></li>
                <li><a href="/servicios" className="hover:text-white transition-colors">Comunidad</a></li>
                <li><a href="/contacto" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
              <Image src="https://i.postimg.cc/c4YYcDsf/BLAST.png" alt="Blast" width={100} height={40} className="opacity-80" />
            </div>

            <div className="space-y-10">
              <div>
                <h4 className="text-[#E30613] font-black uppercase tracking-widest text-sm mb-6 italic">Llámanos</h4>
                <div className="flex items-center gap-3 text-white font-black text-xl italic">
                  <Phone className="w-6 h-6 text-[#E30613]" fill="#E30613" />
                  <span>+52 (669) 991 1292</span>
                </div>
              </div>
              <div className="relative w-20 h-24">
                <Image src="https://i.postimg.cc/4x1q0QJt/proenergeicos.png" alt="Escudo Footer" fill sizes="200px" className="object-contain" />
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">
            <p>© 2026 PROENERGÉTICOS S.A. DE C.V. — MAZATLÁN, SINALOA</p>
            <p>CUMPLIMIENTO NOM-016-CRE-2016</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

