'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

import SiteShell from '@/components/SiteShell';
import InicioOfertaSection from '@/components/InicioOfertaSection';

export default function Page() {
  return (
    <SiteShell>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-5 md:px-8 lg:px-12">
        <div className="space-y-3 md:space-y-6">
          {/* HERO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative w-full md:min-h-[560px] lg:min-h-[68vh] bg-gray-950 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl md:mt-2 lg:mt-3"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/gasolinera/PLANTA/Planta4.jpg"
                alt="Planta de Almacenamiento Grupo Proenergéticos"
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-55 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/90 lg:bg-gradient-to-r lg:from-black/80 lg:via-black/40 lg:to-transparent z-10" />
            </div>

            <div className="relative z-20 w-full px-5 sm:px-6 md:px-16 lg:px-24 pt-4 pb-4 sm:py-8 md:py-12">
              <div className="flex flex-col gap-2.5 max-md:gap-[10px] sm:gap-6 md:gap-8">
                <div className="w-full min-w-0 text-center sm:text-left">
                  <p className="m-0 font-black uppercase italic tracking-tighter leading-none text-[clamp(1.05rem,3.8vw,1.65rem)] sm:text-[clamp(1.15rem,2.8vw,1.85rem)] md:text-[1.75rem] lg:text-[2rem] text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.5)]">
                    Grupo <span className="text-white">Pro</span>
                    <span className="text-[#E30613]">energéticos</span>
                  </p>
                  <div className="mt-2.5 sm:mt-3 flex items-center justify-center sm:justify-start gap-2.5">
                    <div className="h-1 w-10 sm:w-12 md:w-14 bg-[#E30613] shrink-0" aria-hidden />
                    <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.22em] sm:tracking-[0.28em] text-white/80 italic">
                      Mazatlán, Sinaloa
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto] items-start gap-x-3 sm:gap-x-5 md:gap-x-6 lg:gap-x-10 xl:gap-x-12 w-full min-w-0 mt-[1lh] text-[clamp(2.4rem,10.8vw,3.15rem)] sm:text-[clamp(2.65rem,6.5vw,3.35rem)] md:text-[5.125rem] lg:text-7xl xl:text-8xl leading-[0.86] sm:leading-[0.88] md:leading-[0.82] lg:leading-[0.9]">
                  <h1 className="min-w-0 text-left font-black text-white tracking-[-0.04em] md:tracking-[-0.05em] lg:tracking-tighter uppercase italic leading-[inherit] [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]">
                    <span className="md:hidden">
                      ENERGÍA QUE
                      <br />
                      <span className="text-[#E30613]">MUEVE A</span>
                      <br />
                      MÉXICO
                    </span>
                    <span className="hidden md:block">
                      ENERGÍA QUE
                      <br />
                      <span className="text-[#E30613]">MUEVE A</span> MÉXICO
                    </span>
                  </h1>
                  <div className="relative shrink-0 h-[3lh] md:h-[2lh] aspect-[92/100] min-h-[6.2rem] min-w-[5.7rem] md:min-h-[8.4rem] md:min-w-[7.7rem]">
                    <Image
                      src="/images/logotipos/ProEner.png"
                      alt="Logo Grupo Proenergéticos"
                      fill
                      sizes="(max-width: 768px) 120px, (max-width: 1280px) 160px, 220px"
                      className="object-contain object-top drop-shadow-2xl"
                      priority
                    />
                  </div>
                </div>

                <p className="max-w-2xl mt-[1lh] mb-[1lh] text-[clamp(0.875rem,3.8vw,0.98rem)] sm:text-sm md:text-xl text-white/95 font-medium italic text-left leading-[1.35] sm:leading-relaxed">
                  En{' '}
                  <span className="font-black uppercase italic">
                    <span className="text-white">Grupo Pro</span>
                    <span className="text-[#E30613]">energéticos</span>
                  </span>{' '}
                  distribuimos combustibles de alta calidad en Mazatlán y zona conurbada — para transporte,
                  industria, flotas y público en general, con certeza en cada litro.
                </p>

                <div className="inline-flex w-fit items-center max-md:mx-auto md:mx-0 bg-black/45 backdrop-blur-sm border border-white/10 px-4 py-2.5 sm:px-5 sm:py-3 md:px-8 md:py-4 rounded-2xl md:rounded-lg shadow-lg">
                  <span className="flex items-center gap-2.5 font-medium uppercase tracking-wide md:tracking-[0.2em] italic">
                    <span className="text-[#E30613] text-lg leading-none shrink-0">●</span>
                    <span className="text-white text-[11px] sm:text-xs md:text-base font-black uppercase italic tracking-wider leading-tight">
                      NOM-016-CRE-2016
                      <span className="block text-[9px] sm:text-[10px] md:text-[11px] font-bold text-gray-300 uppercase tracking-[0.14em] not-italic mt-0.5">
                        Certificación Vigente
                      </span>
                    </span>
                  </span>
                </div>

                <div className="flex flex-col items-center md:flex-row md:flex-wrap xl:flex-nowrap md:items-stretch md:w-full md:min-w-0 gap-2 max-md:gap-2 sm:gap-3 md:gap-2 lg:items-center lg:gap-4 xl:w-auto">
                  <a
                    href="/estaciones?estacion=gsi"
                    className="w-full max-w-[19rem] sm:max-w-md md:max-w-none md:flex-1 md:min-w-0 md:w-auto lg:flex-none lg:shrink-0 bg-[#E30613] text-white px-5 md:px-3 lg:px-8 py-3 sm:py-4 md:py-2.5 lg:py-4 rounded-2xl md:rounded-lg lg:rounded-xl font-black uppercase tracking-[0.1em] md:tracking-[0.07em] lg:tracking-widest flex items-center justify-between md:justify-center gap-3 md:gap-1.5 lg:gap-3 hover:bg-white hover:text-black transition-all group text-xs sm:text-sm md:text-[10px] lg:text-base shadow-lg shadow-red-900/25"
                  >
                    <span className="md:leading-tight lg:leading-normal">Gasolinera Santa Irene</span>
                    <ArrowRight className="w-5 h-5 md:w-3.5 md:h-3.5 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform shrink-0" />
                  </a>
                  <a
                    href="/estaciones?estacion=gpo"
                    className="w-full max-w-[19rem] sm:max-w-md md:max-w-none md:flex-1 md:min-w-0 md:w-auto lg:flex-none lg:shrink-0 bg-[#E30613] text-white px-5 md:px-3 lg:px-8 py-3 sm:py-4 md:py-2.5 lg:py-4 rounded-2xl md:rounded-lg lg:rounded-xl font-black uppercase tracking-[0.1em] md:tracking-[0.07em] lg:tracking-widest flex items-center justify-between md:justify-center gap-3 md:gap-1.5 lg:gap-3 hover:bg-white hover:text-black transition-all group text-xs sm:text-sm md:text-[10px] lg:text-base shadow-lg shadow-red-900/25"
                  >
                    <span className="md:leading-tight lg:leading-normal">Gasolinera El Pozole</span>
                    <ArrowRight className="w-5 h-5 md:w-3.5 md:h-3.5 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform shrink-0" />
                  </a>
                  <a
                    href="/corporativo"
                    className="w-full max-w-[19rem] sm:max-w-md md:max-w-none md:flex-1 md:min-w-0 md:w-auto lg:flex-none lg:shrink-0 bg-white text-gray-900 border border-gray-200 px-5 md:px-3 lg:px-8 py-3 sm:py-4 md:py-2.5 lg:py-4 rounded-2xl md:rounded-lg lg:rounded-xl font-black uppercase tracking-[0.1em] md:tracking-[0.07em] lg:tracking-widest hover:bg-gray-100 hover:text-black transition-all text-center text-xs sm:text-sm md:text-[10px] lg:text-base md:leading-tight lg:leading-normal shadow-lg shadow-black/20"
                  >
                    Planta de Distribución
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <InicioOfertaSection />
        </div>
      </div>
    </SiteShell>
  );
}
