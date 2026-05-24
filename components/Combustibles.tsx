'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Ship,
  Shield,
  History,
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
          {text || 'GRUPO PRO-ENERGÉTICOS'}
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

const sectoresImgBase = '/images/sectores productivos';

const sectores = [
  { name: 'Industrial', image: `${sectoresImgBase}/industria.jpg`, desc: 'Suministro continuo para plantas y maquinaria pesada.' },
  { name: 'Agricultura', image: `${sectoresImgBase}/agricultura.jpg`, desc: 'Diésel y combustibles para el campo y la cosecha.' },
  { name: 'Pesquero', image: `${sectoresImgBase}/pesquero.jpg`, desc: 'Abasto confiable para embarcaciones y flota costera.' },
  { name: 'Minería', image: `${sectoresImgBase}/mineria.jpeg`, desc: 'Energía para equipos y operaciones de extracción.' },
  { name: 'Construcción', image: `${sectoresImgBase}/construccion.jpg`, desc: 'Combustible para obra, transporte y maquinaria.' },
  { name: 'Naviero', image: `${sectoresImgBase}/naviero.jpg`, desc: 'Diésel marino y logística portuaria en Mazatlán.' },
  { name: 'Hotelero', image: `${sectoresImgBase}/hotelero.jpg`, desc: 'Servicio para hoteles, restaurantes y turismo.' },
  { name: 'Transporte', image: `${sectoresImgBase}/transporte.jpg`, desc: 'Gasolina y diésel para flotas y carga regional.' },
  { name: 'Hospitales', image: `${sectoresImgBase}/hospitales.jpg`, desc: 'Respaldo energético para servicios de salud.' },
] as const;

function SectorCard({
  name,
  desc,
  image,
  index,
}: {
  name: string;
  desc: string;
  image: string;
  index: number;
}) {
  return (
    <div className="group relative h-full">
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none shadow-[0_0_20px_rgba(227,6,19,0.3),0_0_40px_rgba(227,6,19,0.1)]"
        aria-hidden
      />
      <motion.article
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.35, delay: index * 0.04 }}
        whileHover={{ y: -5 }}
        className="relative z-10 flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-colors duration-300 group-hover:border-2 group-hover:border-[#E30613]"
      >
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-t-2xl bg-gray-900">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 520px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
          <h4 className="absolute bottom-3 left-3 right-3 text-sm font-black uppercase tracking-wide text-white drop-shadow-sm sm:text-base">
            {name}
          </h4>
        </div>
        <div className="flex flex-1 flex-col bg-white p-5 sm:p-6">
          <p className="text-sm font-medium leading-relaxed text-gray-600 sm:text-base">{desc}</p>
        </div>
      </motion.article>
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

            <p className="text-base sm:text-xl md:text-3xl font-medium text-white leading-snug sm:leading-tight max-w-3xl italic">              
              <span className="font-black uppercase italic">
                <span className="text-white">Grupo Pro-</span>
                <span className="text-[#E30613]">energéticos</span>
              </span>{' '}
              ha sido un pilar fundamental desde el año 2015, evolucionando para garantizar la certeza del suministro nacional.
            </p>
          </div>

          <div className="absolute right-[-5%] bottom-[-10%] opacity-[0.03] select-none pointer-events-none hidden lg:block">
            <span className="text-[12rem] font-black italic uppercase leading-none">
              <span className="text-white">Grupo Pro-</span>
              <span className="text-[#E30613]">energeticos</span>
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
                  <SectorCard
                    key={sector.name}
                    name={sector.name}
                    desc={sector.desc}
                    image={sector.image}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}