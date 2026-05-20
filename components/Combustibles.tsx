'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fuel,
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
import GasolinasSlider from './GasolinasSlider';
import AditecPanel from './AditecPanel';

type TabId = 'aditec' | 'gasolinas' | 'diesel' | 'magna_premium' | 'historia';

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
          {text || 'PROENERGÉTICOS'}
        </div>
      )}
    </div>
  );
};

const tabs = [
  { id: 'aditec', label: 'Aditec®', icon: Zap },
  { id: 'gasolinas', label: 'Gasolinas', icon: Fuel },
  { id: 'diesel', label: 'Diésel', icon: Ship },
  { id: 'magna_premium', label: '¿Magna/Premium?', icon: Shield },
  { id: 'historia', label: 'Historia', icon: History },
] as const;

const sectores = [
  { name: 'Industrial', icon: Factory },
  { name: 'Agricultura', icon: Sprout },
  { name: 'Pesquero', icon: Ship },
  { name: 'Minería', icon: Pickaxe },
  { name: 'Construcción', icon: HardHat },
  { name: 'Naviero', icon: Anchor },
  { name: 'Hotelero', icon: Hotel },
  { name: 'Transporte', icon: Truck },
  { name: 'Hospitales', icon: Hospital },
];

export default function Combustibles() {
  const [activeTab, setActiveTab] = useState<TabId>('aditec');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'aditec':
        return <AditecPanel />;
      case 'gasolinas':
        return <GasolinasSlider />;
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
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-4xl md:text-7xl font-black italic text-gray-900 leading-[0.9] uppercase tracking-tighter">
            Combustibles: <br className="hidden md:block"/> 
            <span className="text-[#E30613]">Calidad con Historia</span>
          </h2>
          <p className="text-lg md:text-2xl text-red-600 font-bold italic mt-4">Certeza en cada litro</p>
        </div>

        {/* HERO BANNER - SECCIÓN ACTUALIZADA ÚNICAMENTE CON TU LEYENDA */}
        <div className="relative mb-16 rounded-[3rem] overflow-hidden bg-[#111827] min-h-[350px] md:min-h-[450px] flex items-center shadow-2xl border border-white/5">
          <div className="absolute inset-0 z-0">
             <SafeImage 
                src={imagenesCombustible.hero_bg} 
                alt="Mazatlán" 
                className="w-full h-full opacity-40 mix-blend-overlay" 
             />
             <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/70 to-transparent" />
          </div>

          <div className="relative z-10 p-10 md:p-20 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-12 bg-[#E30613]"></div>
              <span className="text-[#E30613] text-xs font-black uppercase tracking-[0.4em] italic">
                Suministro Estratégico
              </span>
            </div>

            {/* Título Corregido */}
            <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic mb-8 leading-[0.9] tracking-tighter">
              Historia en Mazatlán
            </h3>

            {/* Leyenda Corregida */}
            <p className="text-xl md:text-3xl font-medium text-white leading-tight max-w-3xl">
              En Grupo <span className="text-[#E30613] font-black italic">Proenergéticos</span> ha sido un pilar fundamental desde el año 2015, evolucionando para garantizar la certeza del suministro nacional.
            </p>
          </div>

          <div className="absolute right-[-5%] bottom-[-10%] opacity-[0.03] select-none pointer-events-none hidden lg:block">
            <span className="text-[12rem] font-black italic uppercase text-white leading-none">
              PROENERGÉTICOS
            </span>
          </div>
        </div>

        {/* Navigation Tabs - TODO ESTO QUEDA IGUAL */}
        <div className="bg-white rounded-[24px] shadow-xl overflow-hidden p-3 md:p-8 mb-10 border border-gray-100">
          <div className="flex flex-wrap justify-center gap-2 mb-8 bg-gray-100 p-2 rounded-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex-1 min-w-[100px] md:min-w-0 flex flex-col md:flex-row items-center justify-center gap-2 py-3 px-2 rounded-xl transition-all font-black uppercase text-[8px] md:text-[10px] leading-tight text-center ${
                  activeTab === tab.id ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-3 h-3 md:w-4 md:h-4" />
                <span>{tab.label}</span>
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

        {/* Sectores Productivos - TODO ESTO QUEDA IGUAL */}
        <div className="mt-20 px-2">
          <h3 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic text-center mb-10">
            Sectores <span className="text-[#E30613]">Productivos</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {sectores.map((sector, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center group transition-all hover:shadow-md hover:-translate-y-1">
                <sector.icon className="w-6 h-6 text-gray-400 group-hover:text-[#E30613] mb-2 transition-colors" />
                <h4 className="text-[9px] md:text-[10px] font-black text-gray-800 uppercase leading-none break-words px-1">{sector.name}</h4>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}