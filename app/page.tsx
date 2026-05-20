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
    detalle: 'BLAST · Mazatlán',
    direccion: 'Luis Donaldo Colosio 14101, Santa Laura, Mazatlán, Sin.',
    href: '/estaciones',
    logo: '/images/logotipos/BLAST.png',
  },
  {
    nombre: 'Gasolinera El Pozole',
    detalle: 'Villa Unión, Sin.',
    direccion: 'Carretera Internacional Sur Km. 60, El Pozole, Villa Unión, Sin.',
    href: '/estaciones',
    logo: '/images/logotipos/GPO.png',
  },
  {
    nombre: 'Planta de Distribución',
    detalle: 'Centro logístico · Mazatlán',
    direccion: 'México 15 1002, Urías, 82070 Mazatlán, Sin.',
    href: '/corporativo',
    logo: '/images/logotipos/ProEner_negro.png',
  },
] as const;

export default function Page() {
  return (
    <SiteShell>
      <div className="w-full max-w-full overflow-hidden p-2 md:p-8 lg:p-12 bg-gray-200">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full min-h-[520px] md:min-h-[560px] lg:min-h-[68vh] bg-gray-950 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex items-center"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/gasolinera/PLANTA/Planta4.jpg"
                alt="Planta de Almacenamiento Grupo Proenergéticos"
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-60 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 lg:bg-gradient-to-r lg:from-black/80 lg:via-black/40 lg:to-transparent z-10" />
            </div>

            <div className="relative z-20 w-full px-6 md:px-16 lg:px-24 py-10 md:py-12">
              <div className="flex items-center gap-4 mb-4 md:mb-6">
                <div className="h-[2px] w-8 md:w-12 bg-[#E30613]" />
                <span className="text-[#E30613] text-[15px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.4em] italic">
                  — GRUPO PROENERGETICOS —
                </span>
              </div>

              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 md:gap-8 lg:gap-12 mb-6 md:mb-8">
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.95] md:leading-[0.9]">
                  ENERGÍA QUE <br />
                  <span className="text-[#E30613]">MUEVE</span> A MÉXICO
                </h1>
                <div className="relative w-24 h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 shrink-0">
                  <Image
                    src="/images/logotipos/ProEner.png"
                    alt="Logo Grupo Proenergéticos"
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              <p className="max-w-2xl text-sm md:text-xl text-white/90 font-medium italic mb-6 md:mb-8 leading-relaxed">
                En <span className="text-white font-black">Grupo Proenergéticos</span> distribuimos combustibles
                de alta calidad en Mazatlán y zona conurbada — para transporte, industria, flotas y público en
                general, con certeza en cada litro.
              </p>

              <div className="inline-flex items-center bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 md:px-8 md:py-4 rounded-lg mb-6 md:mb-8 shadow-xl max-w-full">
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

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 w-full sm:w-auto">
                <a
                  href="/estaciones"
                  className="w-full sm:w-auto bg-[#E30613] text-white px-6 md:px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all group text-xs sm:text-sm md:text-base"
                >
                  <span>Gasolinera Santa Irene</span>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform shrink-0" />
                </a>
                <a
                  href="/estaciones"
                  className="w-full sm:w-auto bg-[#E30613] text-white px-6 md:px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all group text-xs sm:text-sm md:text-base"
                >
                  <span>Gasolinera El Pozole</span>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform shrink-0" />
                </a>
                <a
                  href="/corporativo"
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 md:px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white/20 transition-all text-center text-xs sm:text-sm md:text-base"
                >
                  Planta de Distribución
                </a>
              </div>
            </div>
          </motion.div>

          {/* Tarjeta única: oferta, productos y ubicaciones */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="bg-gray-100 rounded-[1.25rem] md:rounded-[2rem] shadow-lg border border-gray-200/80 overflow-hidden"
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
              <h3 className="flex items-center gap-2 mb-3 text-sm md:text-base font-black text-gray-900 uppercase italic">
                <span className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#E30613]" />
                </span>
                Dónde <span className="text-[#E30613]">estamos</span>
              </h3>
              <div className="rounded-xl md:rounded-2xl bg-gray-200/60 border border-gray-200/90 p-3 md:p-4">
                <ul className="grid grid-cols-1 min-[520px]:grid-cols-3 gap-3 md:gap-4">
                  {ubicaciones.map((u) => (
                    <li key={u.nombre} className="min-w-0">
                      <a
                        href={u.href}
                        className="group flex flex-col h-full rounded-xl border border-gray-200/90 bg-gray-50 p-3 md:p-4 shadow-sm transition-all duration-300 hover:border-[#E30613]/40 hover:bg-white hover:shadow-md"
                      >
                        <div className="relative w-full h-12 md:h-14 mb-2.5 shrink-0 rounded-lg overflow-hidden bg-white ring-1 ring-gray-200/90">
                          <Image
                            src={u.logo}
                            alt=""
                            fill
                            className="object-contain p-1.5"
                            sizes="160px"
                            unoptimized
                          />
                        </div>
                        <p className="text-[11px] md:text-sm font-black text-gray-900 uppercase italic leading-tight group-hover:text-[#E30613] transition-colors">
                          {u.nombre}
                        </p>
                        <p className="text-[9px] md:text-[10px] font-bold text-[#E30613] uppercase tracking-wide mt-0.5">
                          {u.detalle}
                        </p>
                        <p className="text-[9px] md:text-xs text-gray-600 font-medium leading-snug mt-1.5">
                          {u.direccion}
                        </p>
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
