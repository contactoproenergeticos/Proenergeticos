'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const dieselSlides = [
  {
    id: 1,
    category: 'AUTOMOTRIZ',
    title: 'PODER Y EFICIENCIA',
    subtitle: 'Fortaleza en tu camino: diésel de alta calidad energética con un mínimo de 45 cetanos, asegurando una ignición rápida y arranque instantáneo en frío.',
    techData: '45 CETANOS MÍNIMO',
    image: 'https://i.postimg.cc/pXGr6mCR/sindy_sussengut_3yv0M3OE6BU_unsplash.jpg',
    logo: 'https://i.postimg.cc/V6WZfQZL/diesel.png',
    accentColor: '#E30613'
  },
  {
    id: 2,
    category: 'AUTOMOTRIZ',
    title: 'MÁXIMO PODER LUBRICANTE',
    subtitle: 'Calidad Ultra Bajo Azufre (UBA) con un máximo de 15 ppm. Vital para proteger los filtros de partículas (DPF) y prolongar la vida útil de motores modernos.',
    techData: 'CALIDAD UBA (15 PPM)',
    image: 'https://i.postimg.cc/qRVzxWLH/brian_stalter_arotxe540N4_unsplash.jpg',
    logo: 'https://i.postimg.cc/V6WZfQZL/diesel.png',
    accentColor: '#E30613'
  },
  {
    id: 3,
    category: 'AUTOMOTRIZ',
    title: 'NORMATIVA INTERNACIONAL',
    subtitle: 'Garantizamos el cumplimiento estricto de las normas NOM-016-CRE-2016 y los estándares de la US EPA para la reducción de emisiones contaminantes.',
    techData: 'CERTIFICACIÓN US EPA',
    image: 'https://i.postimg.cc/tT37SDS8/camion.jpg',
    logo: 'https://i.postimg.cc/V6WZfQZL/diesel.png',
    accentColor: '#E30613'
  },
  {
    id: 4,
    category: 'MARINO',
    title: 'ESPECIALIDAD MAZATLÁN',
    subtitle: 'Diseñado específicamente para la flota pesquera. Su alta capacidad de ignición garantiza que el motor responda bajo las cargas de arrastre más pesadas.',
    techData: 'ALTA CAPACIDAD DE IGNICIÓN',
    image: 'https://i.postimg.cc/SKwztnym/noaa_KCIis_Hq_Pd_SM_unsplash.jpg',
    logo: 'https://i.postimg.cc/mkZXhXKj/PROD_MARINO.png',
    accentColor: '#00A3E0'
  },
  {
    id: 5,
    category: 'MARINO',
    title: 'ESTABILIDAD TÉRMICA',
    subtitle: 'Resistencia probada a temperaturas extremas de hasta 60°C. Evita la formación de gomas y sedimentos que obstruyen inyectores en alta mar.',
    techData: 'HASTA 60°C',
    image: 'https://i.postimg.cc/Gtj82zvk/fredrick_f_U9_p_RASawlc_unsplash.jpg',
    logo: 'https://i.postimg.cc/mkZXhXKj/PROD_MARINO.png',
    accentColor: '#00A3E0'
  },
  {
    id: 6,
    category: 'MARINO',
    title: 'PROTECCIÓN ANTICORROSIVA',
    subtitle: 'Combustible Grado Exportación libre de agua y sedimentos, con protección avanzada contra la corrosión salina en el sistema de inyección naval.',
    techData: 'PEMEX EXPORTACIÓN',
    image: 'https://i.postimg.cc/5NxQGdMf/barco.jpg',
    logo: 'https://i.postimg.cc/mkZXhXKj/PROD_MARINO.png',
    accentColor: '#00A3E0'
  }
];

export default function DieselSlider() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % dieselSlides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + dieselSlides.length) % dieselSlides.length);

  const slide = dieselSlides[current];

  return (
    <div className="relative w-full min-h-[700px] md:h-[650px] bg-black rounded-[30px] md:rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/5">
      {/* LADO IZQUIERDO */}
      <div className="w-full md:w-1/2 p-8 md:p-20 flex flex-col justify-center z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 text-white mb-4 block">
              DIÉSEL {slide.category}
            </span>
            <h2 className="text-4xl md:text-6xl font-black italic uppercase leading-[0.9] text-white mb-6 md:mb-8">
              {slide.title.split(' ')[0]} <br />
              <span style={{ color: slide.accentColor }}>{slide.title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-white/60 text-base md:text-lg font-medium max-w-md leading-relaxed">
              {slide.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap items-center gap-6 md:gap-8 mt-10 md:mt-12">
          <div className="flex gap-4">
            <button onClick={prev} className="p-3 md:p-4 rounded-full border border-white/10 hover:bg-white/5 text-white transition-all">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button onClick={next} className="p-3 md:p-4 rounded-full text-white transition-all" style={{ backgroundColor: slide.accentColor }}>
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          <div className="flex items-center border-l border-white/20 pl-6 md:pl-8 h-16 md:h-24">
            <AnimatePresence mode="wait">
              <div className="relative h-16 md:h-24 w-24 md:w-32">
                <Image 
                  key={`logo-${slide.id}`}
                  src={slide.logo} 
                  alt="Certificación" 
                  fill
                  className={`object-contain brightness-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
                  sizes="128px"
                  referrerPolicy="no-referrer"
                />
              </div>
            </AnimatePresence>
          </div>   
        </div>
      </div>

      {/* LADO DERECHO */}
      <div className="w-full md:w-1/2 h-[300px] md:h-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
            <Image 
              src={slide.image} 
              alt={slide.title} 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              referrerPolicy="no-referrer"
            />
            
            {/* EL LETRERO: CORREGIDO PARA QUE NO SE CORTE */}
            <div className="absolute bottom-6 right-6 md:bottom-10 right-10 z-30 bg-black/70 backdrop-blur-xl p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/10 min-w-[150px] md:min-w-[280px] max-w-[80%]">
              <p className="font-black italic text-[8px] md:text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: slide.accentColor }}>
                ESPECIFICACIÓN TÉCNICA
              </p>
              <h4 className="text-white font-black italic text-lg md:text-2xl leading-tight uppercase whitespace-normal">
                {slide.techData}
              </h4>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}