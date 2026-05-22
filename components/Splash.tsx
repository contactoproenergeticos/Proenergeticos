'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO_SRC = '/images/logotipos/ProEner.png';
const PARTICLE_COUNT = 28;

/** Ritmo del splash: intro del logo → typewriter → pausa para leer → fade out */
const LOGO_INTRO_MS = 1500;
const TEXT_START_MS = LOGO_INTRO_MS;
const HOLD_AFTER_TEXT_MS = 3200;
const FADE_OUT_MS = 550;

const CHAR_MS = {
  title: 30,
  tagline: 20,
  subtitle: 16,
  bullets: 14,
} as const;

const GAP_MS = 120;

const TITLE = 'GRUPO PRO-ENERGÉTICOS';
const TAGLINE_A = 'TECNOLOGÍA EN MOVIMIENTO, ';
const TAGLINE_B = 'CALIDAD QUE SE SIENTE.';
const SUBTITLE = 'Tu socio estratégico de combustible en Mazatlán y Sinaloa.';
const BULLETS = '• Trazabilidad Total • Servicio Marino • Suministro Industrial';

const taglineStart = TITLE.length * CHAR_MS.title + GAP_MS;
const taglineBStart = taglineStart + TAGLINE_A.length * CHAR_MS.tagline;
const subtitleStart = taglineBStart + TAGLINE_B.length * CHAR_MS.tagline + GAP_MS;
const bulletsStart = subtitleStart + SUBTITLE.length * CHAR_MS.subtitle + GAP_MS;

const TEXT_FINISH_MS =
  TEXT_START_MS + bulletsStart + BULLETS.length * CHAR_MS.bullets;
const FADE_OUT_AT_MS = TEXT_FINISH_MS + HOLD_AFTER_TEXT_MS;
const TOTAL_MS = FADE_OUT_AT_MS + FADE_OUT_MS;

type SplashProps = {
  onComplete: () => void;
};

function useTypewriter(
  text: string,
  active: boolean,
  charMs: number,
  startDelayMs = 0,
) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!active) {
      setVisible(0);
      return;
    }
    setVisible(0);
    let frame = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        frame += 1;
        setVisible(frame);
        if (frame >= text.length && interval) clearInterval(interval);
      }, charMs);
    }, startDelayMs);
    return () => {
      clearTimeout(startTimer);
      if (interval) clearInterval(interval);
    };
  }, [text, active, charMs, startDelayMs]);

  return text.slice(0, visible);
}

function ParticleRing({ phase }: { phase: 'spin' | 'expand' }) {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        return {
          angle,
          size: 2 + (i % 5) * 0.9,
          delay: i * 0.018,
          sparkle: i % 3 === 0,
        };
      }),
    [],
  );

  const innerR = phase === 'spin' ? 52 : 72;
  const outerR = phase === 'spin' ? 88 : 148;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{ rotate: phase === 'spin' ? 360 : 0 }}
      transition={{
        duration: phase === 'spin' ? 1.1 : 0.5,
        ease: phase === 'spin' ? 'linear' : 'easeOut',
      }}
    >
      {particles.map((p, i) => {
        const cos = Math.cos(p.angle);
        const sin = Math.sin(p.angle);
        const x1 = cos * innerR;
        const y1 = sin * innerR;
        const x2 = cos * outerR;
        const y2 = sin * outerR;
        return (
          <motion.span
            key={i}
            className={`absolute left-1/2 top-1/2 rounded-full ${
              p.sparkle
                ? 'bg-amber-200 shadow-[0_0_12px_#F5D76E,0_0_4px_#fff]'
                : 'bg-amber-400/90 shadow-[0_0_8px_#D4AF37]'
            }`}
            style={{ width: p.size, height: p.size, marginLeft: -p.size / 2, marginTop: -p.size / 2 }}
            initial={{ x: x1, y: y1, scale: 0, opacity: 0 }}
            animate={{
              x: phase === 'spin' ? [x1, x1 * 1.15, x1] : [x1, x2, x2 * 1.08],
              y: phase === 'spin' ? [y1, y1 * 1.15, y1] : [y1, y2, y2 * 1.08],
              scale: phase === 'spin' ? [0, 1.4, 1] : [1, 1.2, 0.2],
              opacity: phase === 'spin' ? [0, 1, 0.85] : [0.9, 0.7, 0],
            }}
            transition={{
              duration: phase === 'spin' ? 1.05 : 0.55,
              delay: p.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        );
      })}
    </motion.div>
  );
}

export default function Splash({ onComplete }: SplashProps) {
  const [phase, setPhase] = useState<'spin' | 'settle' | 'text' | 'exit'>('spin');
  const [particlePhase, setParticlePhase] = useState<'spin' | 'expand'>('spin');
  const [textActive, setTextActive] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('settle');
      setParticlePhase('expand');
    }, LOGO_INTRO_MS);
    const t2 = setTimeout(() => {
      setPhase('text');
      setTextActive(true);
    }, TEXT_START_MS);
    const t3 = setTimeout(() => setPhase('exit'), FADE_OUT_AT_MS);
    const t4 = setTimeout(() => onComplete(), TOTAL_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const titleTyped = useTypewriter(TITLE, textActive, CHAR_MS.title, 0);
  const taglineATyped = useTypewriter(TAGLINE_A, textActive, CHAR_MS.tagline, taglineStart);
  const taglineBTyped = useTypewriter(TAGLINE_B, textActive, CHAR_MS.tagline, taglineBStart);
  const subtitleTyped = useTypewriter(SUBTITLE, textActive, CHAR_MS.subtitle, subtitleStart);
  const bulletsTyped = useTypewriter(BULLETS, textActive, CHAR_MS.bullets, bulletsStart);

  const showBullets = bulletsTyped.length > 8;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden splash-scene"
      role="dialog"
      aria-label="Bienvenida Grupo Pro-energéticos"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: FADE_OUT_MS / 1000, ease: 'easeInOut' }}
    >
      {/* Fondo carbón + textura */}
      <motion.div
        className="absolute inset-0 bg-[#0a0a0c]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      />
      <motion.div
        className="absolute inset-0 splash-grain opacity-[0.35]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 0.5 }}
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_42%,#1a1214_0%,#0a0a0c_55%,#000_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_50%_38%,rgba(227,6,19,0.22)_0%,transparent_70%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.75)_100%)]"
        aria-hidden
      />

      {/* Contenido central */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-lg px-6 sm:px-8">
        {/* Escudo + partículas */}
        <div
          className="relative mb-6 sm:mb-8"
          style={{ perspective: 1400, perspectiveOrigin: '50% 40%' }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-64 sm:h-64"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-[#E30613]/20 blur-[70px] rounded-full" />
          </motion.div>

          <div className="relative w-[200px] h-[230px] sm:w-[220px] sm:h-[255px]">
            <ParticleRing phase={particlePhase} />

            <motion.div
              className="relative w-full h-full"
              style={{ transformStyle: 'preserve-3d' }}
              initial={{
                scale: 0.04,
                rotateY: 1080,
                rotateX: 18,
                opacity: 0,
              }}
              animate={
                phase === 'spin'
                  ? {
                      scale: 0.92,
                      rotateY: 180,
                      rotateX: 8,
                      opacity: 1,
                    }
                  : {
                      scale: 1,
                      rotateY: -32,
                      rotateX: 14,
                      opacity: 1,
                    }
              }
              transition={
                phase === 'spin'
                  ? { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
                  : { duration: 0.4, ease: [0.34, 1.45, 0.64, 1] }
              }
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[78%] h-[88%] drop-shadow-[0_24px_48px_rgba(0,0,0,0.65)]">
                  <Image
                    src={LOGO_SRC}
                    alt="Escudo Grupo Pro-energéticos"
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent mix-blend-overlay pointer-events-none"
                    animate={{ opacity: [0.2, 0.55, 0.25] }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse' }}
                  />
                </div>
              </div>

              {/* Reflejo en “suelo” */}
              <motion.div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-8 opacity-25 blur-md"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(227,6,19,0.5) 0%, transparent 70%)',
                }}
                initial={{ scaleX: 0.2, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.35 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              />
            </motion.div>
          </div>
        </div>

        {/* Textos */}
        <motion.div
          className="text-center w-full space-y-3 sm:space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: textActive ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <h1
            className="text-xl sm:text-2xl md:text-3xl font-black italic tracking-tight uppercase text-white min-h-[1.35em]"
            aria-label={TITLE}
          >
            {titleTyped}
            <span
              className="inline-block w-[2px] h-[0.85em] bg-white/80 ml-0.5 align-middle animate-pulse"
              aria-hidden
              style={{
                opacity: titleTyped.length < TITLE.length && textActive ? 1 : 0,
              }}
            />
          </h1>

          <p className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.12em] sm:tracking-[0.18em] leading-relaxed min-h-[2.6em]">
            <span className="text-white/95">{taglineATyped}</span>
            <span className="text-amber-300">{taglineBTyped}</span>
          </p>

          <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium italic leading-relaxed max-w-md mx-auto min-h-[1.4em]">
            {subtitleTyped}
          </p>

          <AnimatePresence>
            {showBullets && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-[9px] sm:text-[10px] text-white/80 font-bold uppercase tracking-[0.15em] sm:tracking-[0.22em] pt-1"
              >
                {bulletsTyped}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Brillo inferior cinematográfico */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"
        aria-hidden
      />
    </motion.div>
  );
}
