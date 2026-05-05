'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const finalSlides = [
  {
    id: 1,
    label: "IDENTIFICA TU GASOLINA",
    title: "¿MAGNA O PREMIUM?",
    text: "El primer paso para el cuidado de tu inversión. No elijas por precio, elige por ingeniería. La salud de tu motor comienza con la decisión correcta en la estación de servicio.",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920",
  },
  {
    id: 2,
    label: "LA GASOLINA PERFECTA",
    title: "NO ES CUÁL ES MEJOR, SINO CUÁL ES LA CORRECTA",
    text: "Cada motor fue diseñado con una relación de compresión específica. Usar el octanaje adecuado garantiza que la explosión ocurra en el momento exacto, optimizando cada gota de combustible.",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1920",
  },
  {
    id: 3,
    label: "¿CUÁL LE PONGO?",
    title: "LA RESPUESTA ESTÁ EN TU AUTO",
    text: "La verdad técnica reside en el manual de usuario o en la tapa del depósito. Los ingenieros han diseñado tu motor para un nivel de antidetonancia específico; ignorarlo es comprometer la eficiencia térmica.",
    image: "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=1920",
  },
  {
    id: 4,
    label: "CICLO DE COMBUSTIÓN",
    title: "ADMISIÓN, COMPRESIÓN, EXPLOSIÓN, ESCAPE",
    text: "En el corazón del motor, el octanaje determina la estabilidad. Una gasolina correcta asegura que la explosión ocurra exactamente cuando el pistón alcanza su punto máximo, transformando cada gota en puro movimiento.",
    image: "https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&q=80&w=1920",
  },
  {
    id: 5,
    label: "INGENIERÍA DE PRECISIÓN",
    title: "MOTORES DE 87 VS 91 OCTANOS",
    text: "Los motores Turbo o de Inyección Directa operan bajo presiones extremas que exigen la estabilidad de los 91 octanos. Los motores de aspiración natural alcanzan su máximo rendimiento con la eficiencia de los 87 octanos.",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1920",
  },
  {
    id: 6,
    label: "IMPORTANTE",
    title: "CONOCE TU MOTOR PARA ELEGIR ENTRE MAGNA Y PREMIUM",
    text: "Elegir entre Magna y Premium es un acto de conocimiento técnico. Al elegir correctamente, proteges los componentes internos, ahorras dinero y mantienes la potencia original respaldada por la tecnología Aditec®.",
    image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=1920",
  }
];

export default function MagnaPremiumSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev === finalSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? finalSlides.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col lg:flex-row w-full lg:min-h-[700px] bg-black rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl border border-white/5">
      
      {/* SECCIÓN IZQUIERDA: TEXTOS, LOGO Y NAVEGACIÓN */}
      <div className="w-full lg:w-[40%] bg-[#0A0A0A] p-6 md:p-12 flex flex-col justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
        
        {/* Fondo decorativo - Oculto en móvil para evitar ruidos visuales */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none hidden md:block">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] border border-white/20 rounded-full"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] border border-[#E30613]/20 rounded-full"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative z-10 space-y-6 md:space-y-10"
        >
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-[28px] md:text-[42px] font-black leading-tight italic uppercase text-center lg:text-left">
              <span className="text-white">EL COMBUSTIBLE IDEAL</span><br />
              <span className="text-[#E30613]">PARA TU MOTOR</span>
            </h2>
            <p className="text-white/80 text-sm md:text-[18px] leading-relaxed max-w-md font-medium text-center lg:text-left mx-auto lg:mx-0">
              La ingeniería de tu vehículo determina el octanaje necesario para un rendimiento óptimo.
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* LOGO ADITEC-MP */}
            <div className="flex justify-center lg:justify-start">
              <Image 
                src="https://i.postimg.cc/7Lcg8BNv/aditec-mp.png" 
                alt="Tecnología Aditec" 
                width={380}
                height={100}
                className="w-full max-w-[280px] md:max-w-[380px] h-auto object-contain brightness-110"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* BOTONES DE NAVEGACIÓN */}
            <div className="flex justify-center lg:justify-start gap-4 pb-4 md:pb-0">
              <button
                onClick={prevSlide}
                className="p-3 md:p-4 rounded-full border border-white/20 text-white transition-all duration-300 hover:bg-[#E30613] hover:border-[#E30613] group"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110" />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 md:p-4 rounded-full border border-white/20 text-white transition-all duration-300 hover:bg-[#E30613] hover:border-[#E30613] group"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* SECCIÓN DERECHA: IMAGEN DINÁMICA */}
      <div className="w-full lg:w-[60%] relative h-[450px] md:h-[600px] lg:h-auto overflow-hidden bg-[#111]">
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
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={finalSlides[current].image}
                alt={finalSlides[current].label}
                fill
                className="object-cover"
                priority
                unoptimized={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            </div>
            
            <div className="absolute inset-0 flex flex-col justify-end">
              <div className="p-6 md:p-12 pb-14 md:pb-24">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2 md:space-y-4"
                >
                  <span className="text-xl md:text-4xl font-black text-[#E30613] italic uppercase block">
                    {finalSlides[current].label}
                  </span>
                  <h3 className="text-base md:text-2xl font-bold text-white italic uppercase leading-tight">
                    {finalSlides[current].title}
                  </h3>
                  <p className="text-white/90 text-xs md:text-base font-medium max-w-xl line-clamp-4 md:line-clamp-none">
                    {finalSlides[current].text}
                  </p>
                </motion.div>
              </div>

              {/* BARRA INFERIOR ROJA */}
              <div className="w-full bg-[#E30613] py-3 px-6 md:px-12">
                <p className="text-white font-black tracking-widest uppercase text-[9px] md:text-xs italic">
                  MÁXIMO RENDIMIENTO, TECNOLOGÍA ADITEC®
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicadores de slide */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 flex gap-1.5 z-20">
          {finalSlides.map((_, i) => (
            <div
              key={i}
              className={`h-1 transition-all duration-300 rounded-full ${
                current === i ? 'w-6 md:w-8 bg-[#E30613]' : 'w-3 md:w-4 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}