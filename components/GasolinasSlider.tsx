'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

type SlideAccent = 'red' | 'green' | 'neutral';

type GasolinaSlide = {
  id: number;
  label: string;
  title: string;
  subtitle: string;
  accent: SlideAccent;
  image: string;
  logo?: string;
  bullets?: { text: string; highlight: string }[];
  footnote?: string;
};

const gasolinasSlides: GasolinaSlide[] = [
  {
    id: 1,
    label: 'NUESTRAS GASOLINAS',
    title: 'PREMIUM Y MAGNA',
    subtitle:
      'Combustibles ultra bajo azufre aditivados con Pemex Aditec® para máximo desempeño, limpieza y protección del motor.',
    accent: 'neutral',
    image:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920',
  },
  {
    id: 2,
    label: 'PEMEX PREMIUM®',
    title: '91 OCTANOS · ALTO DESEMPEÑO',
    subtitle: 'Gasolina ultra bajo azufre diseñada para motores exigentes.',
    accent: 'red',
    image:
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1920',
    logo: '/images/logotipos/Pemex-Premium.png',
    bullets: [
      { text: 'Gasolina ultra bajo azufre de 91 octanos.', highlight: '91 octanos' },
      { text: 'Aditivada con Pemex Aditec®.', highlight: 'Pemex Aditec®' },
      {
        text: 'Para motores de alta compresión, inyección directa y turbo.',
        highlight: 'inyección directa y turbo',
      },
      {
        text: 'Cumple NOM-016-CRE-2016 y estándares US EPA.',
        highlight: 'NOM-016-CRE-2016',
      },
    ],
    footnote: '*United States Environmental Protection Agency',
  },
  {
    id: 3,
    label: 'PEMEX MAGNA®',
    title: '87 OCTANOS · USO DIARIO',
    subtitle: 'La opción eficiente para la mayoría de automóviles en circulación.',
    accent: 'green',
    image:
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1920',
    logo: '/images/logotipos/Pemex-Magna.png',
    bullets: [
      { text: 'Gasolina ultra bajo azufre de 87 octanos.', highlight: '87 octanos' },
      { text: 'Aditivada con Pemex Aditec®.', highlight: 'Pemex Aditec®' },
      {
        text: 'Para motores de inyección multipunto y compresión media.',
        highlight: 'inyección multipunto',
      },
      {
        text: 'Cumple NOM-016-CRE-2016 y estándares US EPA.',
        highlight: 'NOM-016-CRE-2016',
      },
    ],
    footnote: '*United States Environmental Protection Agency',
  },
  {
    id: 4,
    label: 'PREMIUM®',
    title: 'ALCANZA EL MÁXIMO POTENCIAL',
    subtitle:
      'Gasolina tipo premium de alto octanaje con Pemex Aditec®: máximo desempeño, limpieza eficiente y protección sólida del motor, con certeza en autenticidad y calidad.',
    accent: 'red',
    image:
      'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&q=80&w=1920',
    logo: '/images/logotipos/Pemex-Premium.png',
  },
  {
    id: 5,
    label: 'MAGNA®',
    title: 'SIEMPRE CONTIGO',
    subtitle:
      'Gasolina tipo regular de óptimo octanaje con Pemex Aditec®: desempeño confiable, limpieza del sistema y protección para el uso cotidiano de tu vehículo.',
    accent: 'green',
    image:
      'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=1920',
    logo: '/images/logotipos/Pemex-Magna.png',
  },
  {
    id: 6,
    label: 'CADENA PEMEX',
    title: 'DE LA EXTRACCIÓN A TU AUTO',
    subtitle:
      'Pemex acompaña cada etapa: exploración, refinación, almacenamiento, aditivación con tecnología mexicana y despacho con calidad verificada en estación.',
    accent: 'neutral',
    image:
      'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1920',
    bullets: [
      { text: '1. Exploramos y extraemos petróleo con infraestructura especializada.', highlight: 'Exploramos' },
      { text: '2. Transportamos y refinamos en altos estándares de calidad.', highlight: 'refinamos' },
      { text: '3. Almacenamos en terminales para abastecer gasolineras.', highlight: 'Almacenamos' },
      { text: '4. Aditivamos con Pemex Aditec® antes del despacho.', highlight: 'Aditec®' },
      { text: '5. Verificamos calidad con laboratorios móviles en cada visita.', highlight: 'laboratorios móviles' },
    ],
  },
];

const accentColor = (accent: SlideAccent) => {
  if (accent === 'red') return '#E30613';
  if (accent === 'green') return '#00843D';
  return '#E30613';
};

function highlightText(text: string, highlight: string, color: string) {
  const i = text.indexOf(highlight);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="font-black" style={{ color }}>
        {highlight}
      </span>
      {text.slice(i + highlight.length)}
    </>
  );
}

export default function GasolinasSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slide = gasolinasSlides[current];
  const color = accentColor(slide.accent);

  const next = () => {
    setDirection(1);
    setCurrent((p) => (p + 1) % gasolinasSlides.length);
  };
  const prev = () => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + gasolinasSlides.length) % gasolinasSlides.length);
  };

  const goTo = (i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };

  return (
    <div className="relative w-full min-h-[520px] md:min-h-[620px] bg-black rounded-[24px] md:rounded-[40px] overflow-hidden flex flex-col lg:flex-row shadow-2xl border border-white/5">
      <motion.div className="w-full lg:w-[42%] p-6 md:p-12 lg:p-14 flex flex-col justify-between z-20 bg-[#0a0a0a] border-b lg:border-b-0 lg:border-r border-white/5">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            initial={{ opacity: 0, x: direction >= 0 ? -24 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? 24 : -24 }}
            transition={{ duration: 0.35 }}
            className="space-y-4 md:space-y-5"
          >
            <span
              className="text-[9px] md:text-[10px] font-black tracking-[0.35em] uppercase block"
              style={{ color }}
            >
              {slide.label}
            </span>
            <h2 className="text-2xl md:text-4xl font-black italic uppercase leading-[0.95] text-white">
              {slide.title}
            </h2>
            <p className="text-white/65 text-sm md:text-base font-medium leading-relaxed">
              {slide.subtitle}
            </p>

            {slide.id === 1 && (
              <motion.div className="space-y-3 pt-2">
                <motion.div className="bg-white/5 border-l-4 border-[#E30613] p-4 rounded-r-xl">
                  <h3 className="text-lg font-black text-white italic uppercase">Pemex Premium®</h3>
                  <p className="text-[10px] font-bold text-red-400 tracking-widest mb-2">91 OCTANOS</p>
                  <p className="text-[11px] text-white/80 font-bold uppercase flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#E30613] shrink-0" />
                    Motores turbo e inyección directa
                  </p>
                </motion.div>
                <motion.div className="bg-white/5 border-l-4 border-[#00843D] p-4 rounded-r-xl">
                  <h3 className="text-lg font-black text-white italic uppercase">Pemex Magna®</h3>
                  <p className="text-[10px] font-bold text-green-400 tracking-widest mb-2">87 OCTANOS</p>
                  <p className="text-[11px] text-white/80 font-bold uppercase flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00843D] shrink-0" />
                    Rendimiento diario optimizado
                  </p>
                </motion.div>
              </motion.div>
            )}

            {slide.bullets && slide.id !== 1 && (
              <ul className="space-y-2.5 pt-1">
                {slide.bullets.map((b) => (
                  <li
                    key={b.text}
                    className="text-[11px] md:text-xs text-white/85 font-medium leading-snug flex gap-2"
                  >
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span>{highlightText(b.text, b.highlight, color)}</span>
                  </li>
                ))}
              </ul>
            )}

            {slide.footnote && (
              <p className="text-[9px] text-white/40 italic pt-1">{slide.footnote}</p>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10">
          <motion.div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              className="p-2.5 md:p-3 rounded-full border border-white/15 text-white hover:bg-white/5 transition-colors"
              aria-label="Diapositiva anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="p-2.5 md:p-3 rounded-full text-white transition-colors"
              style={{ backgroundColor: color }}
              aria-label="Siguiente diapositiva"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>

          {slide.logo && (
            <motion.div className="relative h-12 w-24 md:h-14 md:w-28 shrink-0">
              <Image src={slide.logo} alt="" fill className="object-contain brightness-110" sizes="112px" />
            </motion.div>
          )}

          <motion.div className="flex gap-1 ml-auto">
            {gasolinasSlides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                className={`h-1 rounded-full transition-all ${
                  i === current ? 'w-6 bg-[#E30613]' : 'w-2 bg-white/25 hover:bg-white/40'
                }`}
                aria-label={`Ir a diapositiva ${i + 1}`}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div className="w-full lg:w-[58%] h-[280px] sm:h-[340px] lg:h-auto min-h-[280px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
            className="absolute inset-0"
          >
            <motion.div
              className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent lg:from-black/80"
              aria-hidden
            />
            <motion.div
              className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-transparent to-black/30"
              aria-hidden
            />
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 58vw"
              unoptimized
            />
            <motion.div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20">
              <motion.div
                className="inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white"
                style={{ backgroundColor: `${color}33`, border: `1px solid ${color}66` }}
              >
                {current + 1} / {gasolinasSlides.length}
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
