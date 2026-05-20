'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

import SiteShell from '@/components/SiteShell';

export default function Page() {
  return (
    <SiteShell>
      {/* Contenedor principal: Ajustamos p-4 y min-h para móviles */}
      <div className="w-full max-w-full overflow-hidden min-h-screen lg:min-h-[85vh] flex items-center justify-center p-2 md:p-8 lg:p-12 bg-gray-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-7xl min-h-[700px] lg:h-[80vh] bg-gray-950 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex items-center"
        >
          {/* BACKGROUND IMAGE */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/gasolinera/PLANTA/Planta4.jpg"
              alt="Planta de Almacenamiento Grupo Proenergéticos"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60 contrast-125"
            />
            {/* Gradiente responsivo: más oscuro en móvil para leer mejor */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 lg:bg-gradient-to-r lg:from-black/80 lg:via-black/40 lg:to-transparent z-10" />
          </div>

          <div className="relative z-20 w-full px-6 md:px-16 lg:px-24 py-12">
            {/* SUB-HEADER */}
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-[2px] w-8 md:w-12 bg-[#E30613]"></div>
              <span className="text-[#E30613] text-[15px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.4em] italic">
                — GRUPO PROENERGETICOS —
              </span>
            </div>

            {/* MAIN TITLE & LOGO - Layout cambia a columna en móvil */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 md:gap-8 lg:gap-12 mb-6 md:mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.95] md:leading-[0.9]">
                ENERGÍA QUE <br />
                <span className="text-[#E30613]">MUEVE</span> A MÉXICO
              </h1>
              {/* ESCUDO - Ajuste de tamaño responsivo */}
              <div className="relative w-24 h-24 md:w-36 md:h-36 lg:w-44 lg:h-44">
                <Image
                  src="/images/logotipos/ProEner.png"
                  alt="Logo Grupo Proenergéticos"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="max-w-xl text-sm md:text-2xl text-white/90 font-medium italic mb-6 md:mb-8">
              Suministro confiable de combustibles de alta calidad para el sector transporte, industrial y marino.
            </p>

            {/* LEYENDA NOM-016 - Responsiva en tamaño y padding */}
            <div className="inline-flex items-center bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 md:px-8 md:py-4 rounded-lg mb-8 md:mb-10 shadow-xl max-w-full">
              <span className="flex items-center font-medium uppercase tracking-wider md:tracking-[0.2em] italic">
                <span className="text-[#E30613] mr-2 opacity-100 scale-90 md:scale-110">●</span> 
                <span className="text-white text-[11px] md:text-base font-black uppercase italic tracking-widest leading-tight">
                  NOM-016-CRE-2016 
                  <span className="block md:inline-block md:ml-2 text-[9px] md:text-[11px] font-normal text-gray-400 font-sans not-italic">
                    Certificación Vigente
                  </span>
                </span>
              </span>
            </div>

            {/* BUTTONS - Stack vertical en móvil, horizontal en sm en adelante */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto">
              <a 
                href="/servicios" 
                className="w-full sm:w-auto bg-[#E30613] text-white px-8 md:px-10 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all group text-sm md:text-base"
              >
                <span>Nuestros Servicios</span>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </a>
              <a 
                href="/estaciones" 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 md:px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white/20 transition-all text-center text-sm md:text-base"
              >
                Ver Estaciones
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </SiteShell>
  );
}