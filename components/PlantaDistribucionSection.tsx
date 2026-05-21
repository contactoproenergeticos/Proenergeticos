'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Truck, Briefcase, Fuel, Bath, ChevronRight, Zap } from 'lucide-react';

const PLANTA_MAP_LINK =
  'https://maps.google.com/?cid=14017863012502601436&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNl';

const PLANTA_DIRECCION = 'Sur, México 15 1002, Urías, 82070 Mazatlán, Sin.';

const SERVICIOS = [
  { icon: Truck, label: 'LOGÍSTICA' },
  { icon: Briefcase, label: 'INDUSTRIAL' },
  { icon: Fuel, label: 'SUMINISTRO' },
  { icon: Bath, label: 'BAÑOS' },
] as const;

function buildMapEmbed(query: string, zoom: number, satellite = false) {
  const mapType = satellite ? '&t=k' : '';
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=es&z=${zoom}${mapType}&output=embed`;
}

function ServicePill({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3 bg-gray-200 px-3.5 py-3.5 sm:px-4 sm:py-4 rounded-full min-w-0">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-[#E30613]" />
      <span className="text-[11px] sm:text-xs md:text-sm font-black text-gray-900 uppercase tracking-tight leading-tight text-center sm:text-left">
        {label}
      </span>
    </div>
  );
}

export default function PlantaDistribucionSection() {
  const abrirMapa = () => {
    window.open(PLANTA_MAP_LINK, '_blank', 'noopener,noreferrer');
  };

  const mapEmbedPuntual = buildMapEmbed(PLANTA_DIRECCION, 17);
  const mapEmbedAmplio = buildMapEmbed(PLANTA_DIRECCION, 14, true);

  return (
    <section className="space-y-8 md:space-y-10">
      <div className="text-center max-w-3xl mx-auto px-2">
        <div className="inline-flex items-center gap-2 bg-[#E30613]/10 px-4 py-2 rounded-full border border-[#E30613]/20 mb-4">
          <Zap className="w-4 h-4 text-[#E30613]" />
          <span className="text-[#E30613] font-black text-[10px] uppercase tracking-[0.25em]">
            Centro Logístico
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
          Planta de <span className="text-[#E30613]">Distribución</span>
        </h2>
        <p className="mt-4 text-gray-500 font-medium text-sm md:text-base leading-relaxed">
          Infraestructura estratégica para suministro industrial, logística de flotas y atención
          corporativa en Mazatlán.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto w-full px-0 sm:px-2"
      >
        <article className="bg-white rounded-[28px] md:rounded-[36px] shadow-xl overflow-hidden border border-gray-100 flex flex-col group transition-all duration-500 hover:shadow-2xl">
          {/* Imagen con logotipo */}
          <div className="relative h-56 sm:h-72 md:h-80 lg:h-[22rem] w-full overflow-hidden bg-gray-100">
            <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-20">
              <div className="relative w-28 h-14 sm:w-32 sm:h-16 md:w-36 md:h-[4.5rem]">
                <Image
                  src="/images/logotipos/ProEner.png"
                  alt="ProEnergéticos"
                  fill
                  className="object-contain drop-shadow-md"
                  unoptimized
                />
              </div>
            </div>
            <Image
              src="/images/gasolinera/PLANTA/Planta3.jpg"
              alt="Planta de Distribución Grupo Proenergéticos"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
          </div>

          {/* Identificación */}
          <div className="px-6 sm:px-10 md:px-12 pt-6 sm:pt-8">
            <h3 className="text-xl sm:text-2xl md:text-[2rem] lg:text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-tight">
              PLANTA DE DISTRIBUCIÓN
            </h3>
            <p className="mt-1.5 text-[10px] sm:text-[11px] font-black text-[#E30613] uppercase tracking-[0.18em]">
              • CENTRO LOGÍSTICO
            </p>

            <div className="flex items-start gap-3 mt-4 sm:mt-5">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#E30613] flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base md:text-lg text-gray-700 font-semibold leading-snug">
                {PLANTA_DIRECCION}
              </p>
            </div>
          </div>

          {/* Servicios */}
          <div className="px-6 sm:px-10 md:px-12 pt-5 pb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {SERVICIOS.map((s) => (
                <ServicePill key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* Pagos */}
          <div className="px-6 sm:px-10 md:px-12 pb-6 md:pb-8">
            <div className="rounded-2xl bg-gray-800 px-5 py-5 sm:px-8 sm:py-6 text-center">
              <p className="text-[9px] sm:text-[10px] text-white font-black uppercase tracking-[0.22em] mb-3 sm:mb-4">
                Aceptamos tarjetas y monederos
              </p>
              <div className="relative w-full h-14 sm:h-16 md:h-[4.75rem] mx-auto max-w-lg md:max-w-2xl">
                <Image
                  src="/images/pagos/pago tarjetas hor.png"
                  alt="Métodos de pago"
                  fill
                  className="object-contain object-center"
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Mapa dual */}
          <div className="mt-auto border-t border-gray-100">
            <div className="px-6 sm:px-10 md:px-12 py-3 sm:py-4 flex items-center justify-between gap-3">
              <p className="text-xs sm:text-sm md:text-base font-black uppercase tracking-[0.18em] text-gray-700">
                Ubicación
              </p>
              <button
                type="button"
                onClick={abrirMapa}
                className="text-xs sm:text-sm md:text-base font-black uppercase tracking-widest text-[#E30613] hover:text-gray-900 flex items-center gap-1.5 transition-colors shrink-0"
              >
                Google Maps
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-1.5 bg-gray-200">
              <div className="relative h-48 sm:h-60 md:h-72 lg:h-80 bg-gray-100 overflow-hidden">
                <iframe
                  title="Ubicación puntual — Planta de Distribución"
                  src={mapEmbedPuntual}
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="relative h-48 sm:h-60 md:h-72 lg:h-80 bg-gray-100 overflow-hidden">
                <iframe
                  title="Ubicación amplia — Planta de Distribución"
                  src={mapEmbedAmplio}
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="px-6 sm:px-10 md:px-12 py-5 sm:py-7">
              <button
                type="button"
                onClick={abrirMapa}
                className="w-full py-4 sm:py-4 md:py-5 bg-[#E30613] text-white font-black uppercase tracking-[0.14em] sm:tracking-widest text-sm sm:text-base md:text-lg hover:bg-gray-900 transition-all duration-300 rounded-full flex items-center justify-center gap-2.5 shadow-lg shadow-red-500/20 active:scale-[0.98]"
              >
                Cómo llegar
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </article>
      </motion.div>
    </section>
  );
}
