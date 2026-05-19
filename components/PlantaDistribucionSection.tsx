'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  MapPin,
  Truck,
  Briefcase,
  Fuel,
  Bath,
  ChevronRight,
  Zap,
} from 'lucide-react';

const PLANTA_MAP_LINK =
  'https://maps.google.com/?cid=14017863012502601436&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNl';

const PLANTA_MAP_EMBED =
  'https://www.google.com/maps?q=Sur,+M%C3%A9xico+15+1002,+Ur%C3%ADas,+82070+Mazatl%C3%A1n,+Sin.&output=embed';

const SERVICIOS = [
  { icon: Truck, label: 'Logística', color: 'text-blue-600' },
  { icon: Briefcase, label: 'Industrial', color: 'text-[#E30613]' },
  { icon: Fuel, label: 'Suministro', color: 'text-gray-700' },
  { icon: Bath, label: 'Baños', color: 'text-gray-500' },
] as const;

function ServiceIcon({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 px-2 py-2 rounded-xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className="text-[9px] font-black text-gray-700 uppercase tracking-tight leading-none">
        {label}
      </span>
    </div>
  );
}

export default function PlantaDistribucionSection() {
  const abrirMapa = () => {
    window.open(PLANTA_MAP_LINK, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
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
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch"
      >
        {/* Tarjeta de la planta */}
        <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-[#E30613] ring-4 ring-[#E30613]/5 flex flex-col h-full group transition-all duration-500 hover:shadow-2xl relative">
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-[#E30613] text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <Zap className="w-3 h-3 fill-white" />
              Centro Logístico
            </div>
          </div>

          <div className="absolute top-4 left-6 z-20">
            <div className="relative w-28 h-14">
              <Image
                src="/images/logotipos/ProEner.png"
                alt="ProEnergéticos"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          <div className="relative h-56 w-full overflow-hidden">
            <Image
              src="/images/gasolinera/PLANTA/Planta3.jpg"
              alt="Planta de Distribución Proenergéticos"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-6 text-left">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-tight mb-1">
                Planta de Distribución
              </h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E30613] animate-pulse" />
                <p className="text-[10px] text-white/90 font-bold uppercase tracking-widest">
                  Centro Logístico
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col flex-grow text-left">
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-4 h-4 text-[#E30613] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 font-bold leading-snug">
                Sur, México 15 1002, Urías, 82070 Mazatlán, Sin.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {SERVICIOS.map((s) => (
                <ServiceIcon key={s.label} {...s} />
              ))}
            </div>

            <div className="flex-grow flex flex-col justify-center py-2 px-4">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-3 italic text-center">
                Aceptamos tarjetas y monederos
              </p>
              <div className="relative w-full h-14 opacity-80 group-hover:opacity-100 transition-opacity">
                <Image
                  src="/images/pagos/pago tarjetas credito.png"
                  alt="Métodos de pago"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={abrirMapa}
              className="w-full mt-6 py-5 bg-[#E30613] text-white font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-all duration-300 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-red-500/20"
            >
              <span>Cómo llegar</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mapa de Google */}
        <div className="flex flex-col h-full min-h-[420px] lg:min-h-0">
          <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#E30613] shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Ubicación
                </p>
                <p className="text-sm font-bold text-gray-800 leading-snug">
                  Sur, México 15 1002, Urías, Mazatlán, Sin.
                </p>
              </div>
            </div>
            <div className="relative flex-grow min-h-[320px] bg-gray-100">
              <iframe
                title="Mapa — Planta de Distribución Proenergéticos"
                src={PLANTA_MAP_EMBED}
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                type="button"
                onClick={abrirMapa}
                className="w-full py-3 text-[11px] font-black uppercase tracking-widest text-[#E30613] hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
              >
                Abrir en Google Maps
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
