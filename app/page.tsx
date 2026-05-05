'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, ArrowRight 
} from 'lucide-react';
import Image from 'next/image';

import SiteShell from '@/components/SiteShell';

export default function Page() {
  return (
    <SiteShell>
      <div className="w-full max-w-full overflow-hidden min-h-[85vh] flex items-center justify-center p-4 md:p-8 lg:p-12 bg-gray-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-7xl h-[80vh] bg-gray-950 rounded-[3rem] overflow-hidden shadow-2xl flex items-center"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="https://i.postimg.cc/vBznk1Jc/unnamed-2.jpg"
              alt="Planta"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              className="object-cover opacity-60 contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
          </div>

          <div className="relative z-20 w-full px-6 md:px-16 lg:px-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[2px] w-12 bg-[#E30613]"></div>
              <span className="text-[#E30613] text-sm font-black uppercase tracking-[0.4em] italic">— LÍDERES EN MAZATLÁN —</span>
            </div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12 mb-8">
              <h1 className="text-3xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
                ENERGÍA QUE <br />
                <span className="text-[#E30613]">MUEVE</span> A MÉXICO
              </h1>
              <Image
                src="https://i.postimg.cc/mDbp1BDF/proenergeicos_imagen.png"
                alt="Logo Hero"
                width={320}
                height={120}
                className="h-20 md:h-36 w-auto object-contain drop-shadow-2xl"
              />
            </div>

            <p className="max-w-xl text-base md:text-lg text-white/90 font-medium italic mb-10">
              Suministro confiable de combustibles de alta calidad para el sector transporte, industrial y marino.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto">
              <a href="/servicios" className="w-full sm:w-auto bg-[#E30613] text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all group">
                <span>Nuestros Servicios</span>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </a>
              <a href="/estaciones" className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white/20 transition-all text-center">
                Ver Estaciones
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </SiteShell>
  );
}