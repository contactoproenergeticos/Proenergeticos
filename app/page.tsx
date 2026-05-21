'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Fuel, MapPin, ChevronRight, Shield, Droplets, Truck, Store } from 'lucide-react';
import Image from 'next/image';

import SiteShell from '@/components/SiteShell';

const productosOfrecidos = [
  {
    id: 'magna-premium',
    titulo: 'Magna® y Premium®',
    etiqueta: 'Pemex Aditec®',
    descripcion: 'Gasolina certificada con aditivos de última generación para desempeño y protección del motor.',
    icon: Shield,
    cardClass: 'bg-gradient-to-br from-emerald-50/90 to-white border-emerald-200/90 hover:border-emerald-500/60',
    iconClass: 'bg-emerald-700 ring-emerald-600/20',
  },
  {
    id: 'diesel',
    titulo: 'Diésel UBA',
    etiqueta: 'Automotriz e industrial',
    descripcion: 'Ultra Bajo Azufre (15 ppm) para motores modernos, DPF y operación industrial.',
    icon: Droplets,
    cardClass: 'bg-gradient-to-br from-gray-100/80 to-white border-gray-200 hover:border-gray-400',
    iconClass: 'bg-gray-900 ring-gray-900/10',
  },
  {
    id: 'mayoreo',
    titulo: 'Mayoreo',
    etiqueta: 'Medio mayoreo',
    descripcion: 'Suministro por volumen y cargas programadas para empresas, flotas y operadores.',
    icon: Truck,
    cardClass: 'bg-gradient-to-br from-red-50/80 to-white border-[#E30613]/25 hover:border-[#E30613]/50',
    iconClass: 'bg-[#E30613] ring-[#E30613]/20',
  },
  {
    id: 'estaciones',
    titulo: 'Estaciones',
    etiqueta: 'Servicio al público',
    descripcion: 'Red propia en Mazatlán con litraje certificado, servicios y facturación digital.',
    icon: Store,
    cardClass: 'bg-gradient-to-br from-amber-50/70 to-white border-amber-200/90 hover:border-amber-400/70',
    iconClass: 'bg-amber-600 ring-amber-600/20',
  },
] as const;

const ubicaciones = [
  {
    nombre: 'Gasolinera Santa Irene',
    detalle: 'BLAST · MAZATLÁN',
    direccion: 'Luis Donaldo Colosio 14101, Santa Laura, Mazatlán, Sin.',
    href: '/estaciones?estacion=gsi',
    logo: '/images/logotipos/BLAST.png',
    logoBoxClass: 'w-[5.25rem] h-11 sm:w-24 sm:h-12 md:w-28 md:h-14',
    logoImageClass: 'object-contain object-right',
  },
  {
    nombre: 'Gasolinera El Pozole',
    detalle: 'VILLA UNIÓN, SIN.',
    direccion: 'Carretera Internacional Sur Km. 60, El Pozole, Villa Unión, Sin.',
    href: '/estaciones?estacion=gpo',
    logo: '/images/logotipos/GPO.png',
    logoBoxClass: 'w-14 h-14 sm:w-16 sm:h-16 md:w-[4.5rem] md:h-[4.5rem]',
    logoImageClass: 'object-contain object-right',
  },
  {
    nombre: 'Planta de Distribución',
    detalle: 'CENTRO LOGÍSTICO · MAZATLÁN',
    direccion: 'México 15 1002, Urías, 82070 Mazatlán, Sin.',
    href: '/corporativo',
    logo: '/images/logotipos/ProEner.png',
    logoBoxClass: 'w-[4.75rem] h-[4.25rem] sm:w-24 sm:h-[5.5rem] md:w-28 md:h-32 lg:w-32 lg:h-36',
    logoImageClass: 'object-contain object-right scale-[1.2] sm:scale-[1.25]',
  },
] as const;

export default function Page() {
  return (
    <SiteShell>
      <div className="w-full max-w-full overflow-hidden bg-gray-200 -mx-4 md:mx-0 px-0 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-3 md:space-y-6">
          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full md:min-h-[560px] lg:min-h-[68vh] bg-gray-950 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl"
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
                <div className="flex items-center justify-center sm:justify-start w-full">
                  <span className="text-[#E30613] text-[11px] sm:text-[13px] md:text-sm font-black uppercase tracking-[0.28em] sm:tracking-[0.28em] md:tracking-[0.4em] italic text-center sm:text-left">
                    — GRUPO PROENERGETICOS —
                  </span>
                </div>

                <div className="flex flex-row items-start justify-between gap-3 sm:gap-5 md:gap-6 lg:gap-10 xl:gap-12 w-full min-w-0 mt-[1lh]">
                  <h1 className="flex-1 min-w-0 max-w-[calc(100%-5.6rem)] sm:max-w-[calc(100%-7.5rem)] md:max-w-none text-left font-black text-white tracking-tighter uppercase italic leading-[0.9] text-[clamp(2.15rem,9.2vw,2.7rem)] sm:text-[clamp(2.25rem,5.1vw,2.9rem)] md:text-[clamp(2.75rem,4.5vw,3.25rem)] lg:text-7xl xl:text-8xl">
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
                      <span className="text-[#E30613]">MUEVE</span> A MÉXICO
                    </span>
                  </h1>
                  <div className="relative shrink-0 w-[4.85rem] h-[5.35rem] sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-44 xl:h-44 mt-0.5">
                    <Image
                      src="/images/logotipos/ProEner.png"
                      alt="Logo Grupo Proenergéticos"
                      fill
                      sizes="(max-width: 640px) 100px, (max-width: 1024px) 128px, 176px"
                      className="object-contain drop-shadow-2xl"
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

                <div className="flex flex-col items-center md:flex-row md:flex-wrap md:items-start gap-2 max-md:gap-2 sm:gap-3 md:gap-4 w-full md:w-auto">
                  <a
                    href="/estaciones?estacion=gsi"
                    className="w-full max-w-[19rem] sm:max-w-md md:max-w-none md:w-auto bg-[#E30613] text-white px-5 md:px-8 py-3 sm:py-4 rounded-2xl md:rounded-xl font-black uppercase tracking-[0.1em] md:tracking-widest flex items-center justify-between md:justify-center gap-3 hover:bg-white hover:text-black transition-all group text-xs sm:text-sm md:text-base shadow-lg shadow-red-900/25"
                  >
                    <span>Gasolinera Santa Irene</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform shrink-0" />
                  </a>
                  <a
                    href="/estaciones?estacion=gpo"
                    className="w-full max-w-[19rem] sm:max-w-md md:max-w-none md:w-auto bg-[#E30613] text-white px-5 md:px-8 py-3 sm:py-4 rounded-2xl md:rounded-xl font-black uppercase tracking-[0.1em] md:tracking-widest flex items-center justify-between md:justify-center gap-3 hover:bg-white hover:text-black transition-all group text-xs sm:text-sm md:text-base shadow-lg shadow-red-900/25"
                  >
                    <span>Gasolinera El Pozole</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform shrink-0" />
                  </a>
                  <a
                    href="/corporativo"
                    className="w-full max-w-[19rem] sm:max-w-md md:max-w-none md:w-auto bg-black/45 backdrop-blur-sm text-white border border-white/15 px-5 md:px-8 py-3 sm:py-4 rounded-2xl md:rounded-xl font-black uppercase tracking-[0.1em] md:tracking-widest hover:bg-white/10 transition-all text-center text-xs sm:text-sm md:text-base"
                  >
                    Planta de Distribución
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tarjeta única: oferta, productos y ubicaciones */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="bg-gray-100 rounded-[2rem] md:rounded-[2rem] shadow-lg border border-gray-200/80 overflow-hidden mx-0 md:mx-0"
            aria-labelledby="inicio-oferta-titulo"
          >
            <div className="h-1 w-full bg-[#E30613]" aria-hidden />

            <div className="px-5 md:px-6 py-4 md:py-5 border-b border-gray-200/80">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-0.5 w-8 bg-[#E30613]" />
                <span className="text-[#E30613] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] italic">
                  Suministro en Mazatlán
                </span>
              </div>
              <h2
                id="inicio-oferta-titulo"
                className="text-xl md:text-2xl lg:text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight"
              >
                Qué ofrecemos y <span className="text-[#E30613]">dónde encontrarnos</span>
              </h2>
              <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-500 font-medium italic max-w-2xl leading-snug">
                Combustibles certificados, modalidades de venta y ubicaciones en la región.
              </p>
            </div>

            <div className="px-5 md:px-6 py-4 md:py-5 border-b border-gray-200/80">
              <h3 className="flex items-center gap-2 mb-3 text-sm md:text-base font-black text-gray-900 uppercase italic">
                <span className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                  <Fuel className="w-4 h-4 text-[#E30613]" />
                </span>
                Qué <span className="text-[#E30613]">vendemos</span>
              </h3>

              <div className="rounded-xl md:rounded-2xl bg-gray-200/60 border border-gray-200/90 p-3 md:p-4">
                <ul className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {productosOfrecidos.map((producto) => {
                    const Icon = producto.icon;
                    return (
                      <li key={producto.id}>
                        <div
                          className={`flex flex-col h-full rounded-xl border p-3 md:p-4 transition-all duration-300 hover:shadow-md ${producto.cardClass}`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ring-4 ring-offset-2 ring-offset-white shrink-0 ${producto.iconClass}`}
                          >
                            <Icon className="w-5 h-5 text-white" strokeWidth={2.25} />
                          </div>
                          <p className="text-sm font-black text-gray-900 uppercase italic leading-tight tracking-tight">
                            {producto.titulo}
                          </p>
                          <p className="text-[10px] font-bold text-[#E30613] uppercase tracking-[0.12em] mt-1">
                            {producto.etiqueta}
                          </p>
                          <p className="text-xs text-gray-600 font-medium leading-relaxed mt-2 flex-1">
                            {producto.descripcion}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <a
                href="/combustible"
                className="inline-flex items-center justify-center gap-2 mt-4 md:mt-5 bg-[#E30613] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest italic shadow-lg shadow-red-500/20 hover:bg-gray-900 transition-all duration-300 group"
              >
                Ver combustibles
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            <div className="px-5 md:px-6 py-4 md:py-5">
              <h3 className="flex items-center gap-2.5 mb-4 text-sm md:text-base font-black text-gray-900 uppercase italic">
                <span className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#E30613]" strokeWidth={2.5} />
                </span>
                Dónde <span className="text-[#E30613]">estamos</span>
              </h3>
              <div className="rounded-2xl md:rounded-[1.75rem] bg-gray-200/70 border border-gray-200/90 p-3 sm:p-4 md:p-5">
                <ul className="flex flex-col lg:grid lg:grid-cols-3 gap-3 md:gap-4">
                  {ubicaciones.map((u) => (
                    <li key={u.nombre} className="min-w-0">
                      <a
                        href={u.href}
                        className="group flex flex-row items-center justify-between gap-3 sm:gap-4 h-full rounded-xl md:rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-[#E30613]/30 hover:shadow-md"
                      >
                        <div className="flex-1 min-w-0 pr-1">
                          <p className="text-[13px] sm:text-sm md:text-base font-black text-gray-900 uppercase italic leading-tight group-hover:text-[#E30613] transition-colors">
                            {u.nombre}
                          </p>
                          <p className="text-[10px] sm:text-[11px] font-bold text-[#E30613] uppercase italic tracking-wide mt-1">
                            {u.detalle}
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium leading-snug mt-1.5">
                            {u.direccion}
                          </p>
                        </div>
                        <div className={`relative shrink-0 ${u.logoBoxClass}`}>
                          <Image
                            src={u.logo}
                            alt=""
                            fill
                            className={u.logoImageClass}
                            sizes="(max-width: 640px) 88px, (max-width: 1024px) 112px, 128px"
                            unoptimized
                          />
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </SiteShell>
  );
}
