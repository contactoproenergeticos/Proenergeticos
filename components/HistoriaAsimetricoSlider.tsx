'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const slides = [
  {
    id: 1,
    year: "1903 - 1938",
    title: "AURORA Y NAFTOLINA",
    text: "Orígenes con 'El Águila', Aurora y Naftolina. La compañía privada produce combustibles sin calidad estandarizada antes de la consolidación nacional.",
    image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 2,
    year: "1940 - 1986",
    title: "MEXOLINA Y OCTANAJE",
    text: "Era de la Mexolina y evolución de octanajes. Desarrollo progresivo de combustibles de 70, 80 y 90 octanos para satisfacer las demandas de motores en crecimiento.",
    image: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 3,
    year: "1990 - 2016",
    title: "MAGNA SIN Y TECNOLOGÍA UBA",
    text: "Introducción de Magna Sin, la primera gasolina sin plomo en México, y la llegada de combustibles Ultra Bajo Azufre (UBA) para un futuro más limpio.",
    image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 4,
    year: "2018 - 2024",
    title: "PEMEX ADITEC® 7ª GENERACIÓN",
    text: "Tecnología de vanguardia con trazadores moleculares que garantiza la autenticidad y máxima limpieza del sistema de inyección.",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1200",
  }
];

export default function HistoriaAsimetricoSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[700px] bg-black rounded-[40px] overflow-hidden shadow-2xl">
      {/* Izquierda (Fija - 40%) */}
      <div className="lg:w-[40%] bg-[#0A0A0A] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
        {/* Decorative background element with subtle texture effect */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] border border-white/20 rounded-full"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] border border-[#E30613]/20 rounded-full"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative z-10 space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-[40px] md:text-[60px] font-black leading-none italic uppercase">
              <span className="text-white">Nuestra pasión:</span><br />
              <span className="text-[#E30613]">La Energía de México</span>
            </h2>
            <p className="text-white text-[18px] leading-relaxed max-w-md font-medium">
              Desde 1938, el combustible en México ha evolucionado con innovación y calidad. En Grupo Proenergéticos somos distribuidores: llevamos esa evolución a la red de estaciones y a quienes confían en nosotros.
            </p>
          </div>

          {/* NUEVA POSICIÓN DE CONTROLES */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={prevSlide}
              className="p-4 rounded-full bg-black border border-white/10 text-white hover:bg-[#E30613] hover:border-[#E30613] transition-all shadow-xl group"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              className="p-4 rounded-full bg-black border border-white/10 text-white hover:bg-[#E30613] hover:border-[#E30613] transition-all shadow-xl group"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Derecha (Slider - 60%) */}
      <div className="lg:w-[60%] relative h-[500px] md:h-[600px] lg:h-auto overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Parallax Image Container */}
            <motion.div 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={slides[current].image}
                alt={slides[current].year}
                fill
                className="object-cover"
                priority
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            {/* Content */}
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <div className="flex flex-col">
                  <motion.span 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl md:text-6xl font-black text-[#E30613] italic tracking-tighter drop-shadow-2xl leading-none"
                  >
                    {slides[current].year}
                  </motion.span>
                  <motion.span 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tight mt-1 drop-shadow-2xl"
                  >
                    {slides[current].title}
                  </motion.span>
                </div>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/90 text-base md:text-lg font-medium leading-relaxed max-w-xl drop-shadow-lg"
                >
                  {slides[current].text}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-8"
                >
                  <p className="text-[#E30613] font-black tracking-[0.3em] uppercase text-xs md:text-sm italic drop-shadow-md">
                    IMPULSAMOS TU MOTOR, MOVEMOS A MÉXICO
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="absolute top-8 md:top-12 right-8 md:right-12 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`h-1 transition-all duration-300 rounded-full ${
                current === i ? 'w-8 bg-[#E30613]' : 'w-4 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
