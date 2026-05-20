'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BASE = '/images/combustibles/aditec';

type AditecSlide = {
  id: number;
  image: string;
  label: string;
  title: string;
  summary: string;
};

const aditecSlides: AditecSlide[] = [
  {
    id: 1,
    image: `${BASE}/aditec-04.png`,
    label: 'TECNOLOGÍA PEMEX',
    title: '¿Qué es Pemex Aditec®?',
    summary:
      'Aditivo exclusivo en Pemex Magna® y Pemex Premium®, con 8 activos que aportan desempeño, limpieza, protección y certeza en autenticidad y calidad.',
  },
  {
    id: 2,
    image: `${BASE}/aditec-05.png`,
    label: 'FÓRMULA',
    title: '8 activos de desempeño',
    summary:
      'La nueva fórmula integra activos de limpieza, protección y trazabilidad para cuidar todo el sistema de combustión.',
  },
  {
    id: 3,
    image: `${BASE}/aditec-06.png`,
    label: 'COMPONENTES',
    title: 'Función de cada activo',
    summary:
      'Desde el trazador molecular hasta el desemulsionante: cada componente cumple un rol específico en el motor.',
  },
  {
    id: 4,
    image: `${BASE}/aditec-07.png`,
    label: 'BENEFICIOS',
    title: '4 beneficios sólidos',
    summary:
      'Máximo desempeño, limpieza eficiente, sólida protección y certeza en la calidad de cada litro.',
  },
  {
    id: 5,
    image: `${BASE}/aditec-02.png`,
    label: 'EN TU AUTO',
    title: '¿Cómo llega al motor?',
    summary:
      'Pemex Aditec® viaja con la gasolina desde el centro de distribución hasta el depósito de tu vehículo.',
  },
  {
    id: 6,
    image: `${BASE}/aditec-03.png`,
    label: 'CADENA DE SUMINISTRO',
    title: 'Mezcla homogénea garantizada',
    summary:
      'En autotanques se dosifica Aditec®; Magna® y Premium® llegan a la red Pemex y licenciatarios con la misma tecnología.',
  },
  {
    id: 7,
    image: `${BASE}/aditec-01.png`,
    label: 'HISTORIA',
    title: 'Más de 30 años de evolución',
    summary:
      'Desde 1987 hasta la nueva fórmula 2024 con trazador molecular: innovación continua en gasolinas Pemex.',
  },
  {
    id: 8,
    image: `${BASE}/aditec-15.png`,
    label: 'CERTIFICACIONES',
    title: 'Clase mundial',
    summary:
      'Cumple normas y registros nacionales e internacionales: CRE, IMPI, EPA y USPTO.',
  },
  {
    id: 9,
    image: `${BASE}/aditec-08.png`,
    label: 'INNOVACIÓN',
    title: 'Fórmula de nueva generación',
    summary:
      'Potencia la limpieza, el rendimiento y ayuda a disminuir la generación de gases contaminantes.',
  },
  {
    id: 10,
    image: `${BASE}/aditec-09.png`,
    label: 'DESEMPEÑO',
    title: 'Máximo desempeño',
    summary:
      'Combustión eficiente para aprovechar al máximo cada litro de gasolina en el motor.',
  },
  {
    id: 11,
    image: `${BASE}/aditec-10.png`,
    label: 'RENDIMIENTO',
    title: 'Hasta +5% de rendimiento',
    summary:
      'La nueva fórmula puede aumentar el rendimiento del combustible según pruebas de laboratorio (metodología EPA).',
  },
  {
    id: 12,
    image: `${BASE}/aditec-11.png`,
    label: 'LIMPIEZA',
    title: 'Limpieza eficiente',
    summary:
      'Mantiene limpias válvulas de admisión e inyectores, contribuyendo a reducir emisiones contaminantes.',
  },
  {
    id: 13,
    image: `${BASE}/aditec-12.png`,
    label: 'VÁLVULAS',
    title: 'Hasta 83% más limpieza',
    summary:
      'Mejora la eficiencia de limpieza en válvulas de admisión (prueba ASTM D6201).',
  },
  {
    id: 14,
    image: `${BASE}/aditec-14.png`,
    label: 'PROTECCIÓN',
    title: 'Hasta 99% anticorrosión',
    summary:
      'Protege superficies metálicas del motor, libres de corrosión (metodología NACE TM0172-2001).',
  },
  {
    id: 15,
    image: `${BASE}/aditec-13.png`,
    label: 'MEDIO AMBIENTE',
    title: 'Menor huella de carbono',
    summary:
      'Puede ayudar a disminuir hasta 5% las emisiones de CO₂ y reducir la huella de carbono.*',
  },
];

export default function AditecSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slide = aditecSlides[current];
  const total = aditecSlides.length;

  const next = () => {
    setDirection(1);
    setCurrent((p) => (p + 1) % total);
  };
  const prev = () => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + total) % total);
  };
  const goTo = (i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };

  return (
    <div className="relative w-full bg-[#0a0a0a] rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl border border-white/5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 md:p-4 bg-white border-b border-gray-100">
        {[
          { v: '+5%', l: 'Rendimiento', s: 'EPA' },
          { v: '83%', l: 'Limpieza', s: 'Válvulas' },
          { v: '99%', l: 'Protección', s: 'NACE' },
          { v: '-5%', l: 'CO₂', s: 'Huella' },
        ].map((m) => (
          <div
            key={m.l}
            className="rounded-xl bg-gray-50 border border-gray-100 py-2 px-2 text-center"
          >
            <span className="block text-lg md:text-xl font-black text-[#E30613] leading-none">{m.v}</span>
            <span className="text-[9px] md:text-[10px] font-black uppercase text-gray-800 tracking-wide">
              {m.l}
            </span>
            <span className="text-[8px] text-gray-400 font-bold">{m.s}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row min-h-[480px] md:min-h-[560px]">
        <div className="lg:w-[36%] p-5 md:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              initial={{ opacity: 0, x: direction >= 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction >= 0 ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <span className="text-[9px] md:text-[10px] font-black tracking-[0.35em] uppercase text-[#00A859]">
                {slide.label}
              </span>
              <h3 className="text-xl md:text-2xl font-black italic uppercase text-white leading-tight">
                {slide.title}
              </h3>
              <p className="text-sm text-white/70 font-medium leading-relaxed">{slide.summary}</p>
              <p className="text-[10px] text-white/40 pt-1">
                Diapositiva {current + 1} de {total} · Desliza para ver toda la información Aditec®
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between gap-3 mt-6 pt-5 border-t border-white/10">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prev}
                className="p-2.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={next}
                className="p-2.5 rounded-full bg-[#00A859] text-white hover:bg-[#00843D] transition-colors"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1 justify-end max-w-[55%]">
              {aditecSlides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? 'w-4 bg-[#00A859]' : 'w-1.5 bg-white/25 hover:bg-white/50'
                  }`}
                  aria-label={`Diapositiva ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-[64%] relative min-h-[280px] sm:min-h-[360px] lg:min-h-0 bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 p-3 md:p-5"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 64vw"
                priority={current < 2}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="px-4 py-2 bg-black/80 border-t border-white/5">
        <p className="text-[8px] md:text-[9px] text-white/45 text-center leading-snug">
          *Resultados según metodologías de laboratorio indicadas en material Pemex. Pueden variar según hábitos de
          manejo y mantenimiento del vehículo.
        </p>
      </div>
    </div>
  );
}
