'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Ship,
  Shield,
  History,
  Factory,
  Sprout,
  Pickaxe,
  HardHat,
  Anchor,
  Hotel,
  Truck,
  Hospital,
} from 'lucide-react';
import Image from 'next/image';

// Asegúrate de que estos archivos existan en tu carpeta de componentes
import HistoriaAsimetricoSlider from './HistoriaAsimetricoSlider';
import MagnaPremiumSlider from './MagnaPremiumSlider';
import DieselSlider from './DieselSlider';
import AditecPanel from './AditecPanel';

type TabId = 'aditec' | 'diesel' | 'magna_premium' | 'historia';

const basePath = '/assets/combustibles'; 
const imagenesCombustible = {
  hero_bg: `${basePath}/hero-bg.jpg`,
};

const SafeImage = ({ src, alt, className, text }: { src: string; alt: string; className?: string; text?: string }) => {
  const [error, setError] = useState(false);
  return (
    <div className={`relative overflow-hidden w-full ${className}`}>
      {!error ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setError(true)}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-white text-[10px] uppercase font-bold p-4 text-center italic">
          {text || 'GRUPO PROENERGÉTICOS'}
        </div>
      )}
    </div>
  );
};

const tabs = [
  { id: 'historia', label: 'Historia', icon: History },
  { id: 'magna_premium', label: '¿Magna/Premium?', icon: Shield },
  { id: 'diesel', label: 'Diésel', icon: Ship },
  { id: 'aditec', label: 'Aditec®', icon: Zap },
] as const;

const sectores = [
  { name: 'Industrial', icon: Factory, desc: 'Suministro continuo para plantas y maquinaria pesada.' },
  { name: 'Agricultura', icon: Sprout, desc: 'Diésel y combustibles para el campo y la cosecha.' },
  { name: 'Pesquero', icon: Ship, desc: 'Abasto confiable para embarcaciones y flota costera.' },
  { name: 'Minería', icon: Pickaxe, desc: 'Energía para equipos y operaciones de extracción.' },
  { name: 'Construcción', icon: HardHat, desc: 'Combustible para obra, transporte y maquinaria.' },
  { name: 'Naviero', icon: Anchor, desc: 'Diésel marino y logística portuaria en Mazatlán.' },
  { name: 'Hotelero', icon: Hotel, desc: 'Servicio para hoteles, restaurantes y turismo.' },
  { name: 'Transporte', icon: Truck, desc: 'Gasolina y diésel para flotas y carga regional.' },
  { name: 'Hospitales', icon: Hospital, desc: 'Respaldo energético para servicios de salud.' },
] as const;

function SectorCard({
  name,
  desc,
  icon: Icon,
  index,
}: {
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
}) {
  return (
    <div className="group relative">
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[0_0_20px_rgba(227,6,19,0.3),0_0_40px_rgba(227,6,19,0.1)]"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.35, delay: index * 0.04 }}
        whileHover={{ y: -5 }}
        className="relative z-10 flex flex-row sm:flex-col items-start sm:items-center text-left sm:text-center gap-4 sm:gap-0 bg-white rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 w-full min-h-0 sm:min-h-[168px] md:min-h-[180px] border border-gray-200 shadow-md overflow-hidden transition-colors duration-300 group-hover:border-2 group-hover:border-[#E30613]"
      >
        <div
          className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gray-900 ring-[3px] ring-[#E30613] ring-offset-2 ring-offset-white flex items-center justify-center sm:mb-3 shrink-0 transition-all duration-300 group-hover:bg-[#E30613] group-hover:ring-[#E30613] group-hover:ring-offset-white"
          aria-hidden
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0 sm:w-full border-l-2 border-[#E30613]/80 pl-3 sm:border-l-0 sm:pl-0">
          <h4 className="text-sm sm:text-xs md:text-sm font-black text-[#E30613] uppercase tracking-wide leading-tight mb-1.5 sm:mb-2">
            {name}
          </h4>
          <div className="hidden sm:block w-8 h-0.5 bg-[#E30613] mx-auto mb-2 rounded-full" aria-hidden />
          <p className="text-sm sm:text-[11px] md:text-sm text-gray-600 font-medium leading-relaxed">
            {desc}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Combustibles() {
  const [activeTab, setActiveTab] = useState<TabId>('historia');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'aditec':
        return <AditecPanel />;
      case 'diesel': return <DieselSlider />;
      case 'magna_premium': return <MagnaPremiumSlider />;
      case 'historia': return <HistoriaAsimetricoSlider />;
      default: return null;
    }
  };

  return (
    <section className="bg-gray-200 py-10 md:py-20 px-4 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Título Principal */}
        <div className="mb-8 sm:mb-10 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-black italic text-gray-900 leading-[0.95] sm:leading-[0.9] uppercase tracking-tighter">
            Combustibles: <br className="hidden md:block"/> 
            <span className="text-[#E30613]">Calidad con Historia</span>
          </h2>
          <p className="text-base sm:text-lg md:text-2xl text-red-600 font-bold italic mt-3 sm:mt-4">Certeza en cada litro</p>
        </div>

        {/* HERO BANNER - SECCIÓN ACTUALIZADA ÚNICAMENTE CON TU LEYENDA */}
        <div className="relative mb-10 md:mb-16 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-[#111827] min-h-[280px] sm:min-h-[350px] md:min-h-[450px] flex items-center shadow-2xl border border-white/5">
          <div className="absolute inset-0 z-0">
             <SafeImage 
                src={imagenesCombustible.hero_bg} 
                alt="Mazatlán" 
                className="w-full h-full opacity-40 mix-blend-overlay" 
             />
             <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/70 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 md:p-20 max-w-4xl">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="h-[2px] w-8 sm:w-12 bg-[#E30613]"></div>
              <span className="text-[#E30613] text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] sm:tracking-[0.4em] italic">
                Suministro Estratégico
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl md:text-6xl font-black text-white uppercase italic mb-4 sm:mb-8 leading-[0.95] sm:leading-[0.9] tracking-tighter">
              Historia en Mazatlán
            </h3>

            <p className="text-base sm:text-xl md:text-3xl font-medium text-white leading-snug sm:leading-tight max-w-3xl">
              En <span className="text-[#E30613] font-black italic">Grupo Proenergéticos</span> ha sido un pilar fundamental desde el año 2015, evolucionando para garantizar la certeza del suministro nacional.
            </p>
          </div>

          <div className="absolute right-[-5%] bottom-[-10%] opacity-[0.03] select-none pointer-events-none hidden lg:block">
            <span className="text-[12rem] font-black italic uppercase text-white leading-none">
              GRUPO PROENERGÉTICOS
            </span>
          </div>
        </div>

        {/* Navigation Tabs - TODO ESTO QUEDA IGUAL */}
        <div className="bg-white rounded-2xl sm:rounded-[24px] shadow-xl overflow-hidden p-4 sm:p-6 md:p-8 mb-8 md:mb-10 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8 bg-gray-100 p-2 sm:p-3 rounded-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex flex-col md:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-1.5 sm:px-3 rounded-xl transition-all font-black uppercase text-[10px] sm:text-xs md:text-sm leading-snug text-center tracking-wide min-h-[72px] sm:min-h-0 ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="px-0.5 leading-tight">{tab.label}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sectores Productivos */}
        <div className="mt-12 sm:mt-16 md:mt-20">
          <div className="bg-white rounded-2xl sm:rounded-[1.75rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-10 shadow-xl border border-gray-100">
            <div className="text-center mb-6 sm:mb-8 md:mb-10 px-1">
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[#E30613] mb-2">
                Soluciones energéticas
              </p>
              <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 uppercase italic tracking-tight leading-tight sm:leading-none">
                Sectores <span className="text-[#E30613]">Productivos</span>
              </h3>
              <p className="mt-2 sm:mt-3 text-sm md:text-base text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                Combustibles de calidad para las industrias que impulsan la economía regional.
              </p>
            </div>

            <div className="rounded-xl sm:rounded-2xl md:rounded-3xl bg-gray-100/90 border border-gray-200 p-3 sm:p-4 md:p-6 lg:p-8">
              <div className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                {sectores.map((sector, i) => (
                  <SectorCard key={sector.name} name={sector.name} desc={sector.desc} icon={sector.icon} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}