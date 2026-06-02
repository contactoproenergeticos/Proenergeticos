'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import {
  MapPin,
  ChevronRight,
  Truck,
  Shield,
  Gauge,
  Cog,
  Calendar,
  Droplets,
  Receipt,
  FlaskConical,
  type LucideIcon,
} from 'lucide-react';

type Producto = {
  id: string;
  headerBar: string;
  headerColor: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  imagenClass?: string;
  ringClass: string;
  badges: { icon: LucideIcon; label: string }[];
};

type Ubicacion = {
  nombre: string;
  detalle: string;
  direccion: string;
  href: string;
  imagen: string;
};

const productosOfrecidos: Producto[] = [
  {
    id: 'magna-premium',
    headerBar: 'Magna® y Premium®',
    headerColor: 'bg-emerald-600',
    titulo: 'Pemex Aditec®',
    descripcion:
      'Gasolina certificada con aditivos de última generación y máxima protección del motor.',
    imagen: '/images/combustibles/magna y premium.PNG',
    imagenClass: 'object-contain p-1.5',
    ringClass: 'ring-emerald-100 bg-emerald-50/60',
    badges: [
      { icon: FlaskConical, label: 'aditivos' },
      { icon: Shield, label: 'protección' },
    ],
  },
  {
    id: 'diesel',
    headerBar: 'Diésel UBA',
    headerColor: 'bg-gray-900',
    titulo: 'Automotriz e industrial',
    descripcion:
      'Ultra Bajo Azufre (15 ppm) diseñado para motores modernos y sistemas DPF.',
    imagen: '/images/combustibles/diesel2.PNG',
    imagenClass: 'object-contain p-1.5',
    ringClass: 'ring-gray-300 bg-gray-100/80',
    badges: [
      { icon: Gauge, label: 'DPF' },
      { icon: Cog, label: 'motores modernos' },
    ],
  },
  {
    id: 'mayoreo',
    headerBar: 'Mayoreo',
    headerColor: 'bg-[#E30613]',
    titulo: 'Medio mayoreo',
    descripcion:
      'Suministro eficiente por volumen, cargas programadas y gestión de flotas.',
    imagen: '/images/combustibles/mayoreo.PNG',
    imagenClass: 'object-cover',
    ringClass: 'ring-red-100 bg-red-50/60',
    badges: [
      { icon: Droplets, label: 'volumen' },
      { icon: Calendar, label: 'cargas programadas' },
      { icon: Truck, label: 'flotas' },
    ],
  },
  {
    id: 'estaciones',
    headerBar: 'Estaciones',
    headerColor: 'bg-amber-500',
    titulo: 'Servicio al público',
    descripcion:
      'Red propia en Mazatlán con servicio certificado y facturación digital inmediata.',
    imagen: '/images/combustibles/servico publico.PNG',
    imagenClass: 'object-cover',
    ringClass: 'ring-amber-100 bg-amber-50/60',
    badges: [
      { icon: Droplets, label: 'litraje certificado' },
      { icon: Receipt, label: 'facturación digital' },
    ],
  },
];

const ubicaciones: Ubicacion[] = [
  {
    nombre: 'Gasolinera Santa Irene',
    detalle: 'BLAST · MAZATLÁN',
    direccion: 'Luis Donaldo Colosio 14101, Santa Laura, Mazatlán, Sin.',
    href: '/estaciones?estacion=gsi',
    imagen: '/images/gasolinera/GSI/gsi3.jpeg',
  },
  {
    nombre: 'Gasolinera El Pozole',
    detalle: 'VILLA UNIÓN, SIN.',
    direccion: 'Carretera Internacional Sur Km. 60, El Pozole, Villa Unión, Sin.',
    href: '/estaciones?estacion=gpo',
    imagen: '/images/gasolinera/GPO/GPO2.jpg',
  },
  {
    nombre: 'Planta de Distribución',
    detalle: 'CENTRO LOGÍSTICO · MAZATLÁN',
    direccion: 'Carretera México 15 1002, Colonia Urías, C.P. 82070 Mazatlán, Sin.',
    href: '/corporativo',
    imagen: '/images/gasolinera/PLANTA/Planta3.jpg',
  },
];

function TimelineNode({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative z-[1] flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#c4a574]/50 bg-white text-[11px] font-black text-gray-800 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 md:mb-5 flex items-center gap-3 min-w-0">
      <h3 className="shrink-0 text-sm sm:text-base md:text-lg font-black uppercase tracking-wide text-gray-900 italic">
        {children}
      </h3>
      <div className="h-px min-w-[2rem] flex-1 bg-gray-300/90" aria-hidden />
    </div>
  );
}

function ProductFooterBadge({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1 px-1 text-center">
      <Icon className="h-5 w-5 text-gray-700" strokeWidth={1.75} aria-hidden />
      <span className="text-[8px] sm:text-[9px] font-semibold lowercase leading-tight text-gray-500">
        {label}
      </span>
    </div>
  );
}

function ProductCardIllustration({
  imagen,
  imagenClass = 'object-contain',
  ringClass,
  alt,
}: {
  imagen: string;
  imagenClass?: string;
  ringClass: string;
  alt: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      {...(reduceMotion
        ? {}
        : {
            animate: { y: [0, -5, 0] },
            transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
          })}
      className={`relative mx-auto h-24 w-full max-w-[10rem] sm:h-28 overflow-hidden rounded-2xl ring-[3px] ${ringClass}`}
    >
      <Image
        src={imagen}
        alt={alt}
        fill
        className={`${imagenClass} transition-transform duration-500 hover:scale-105`}
        sizes="(max-width: 640px) 40vw, 160px"
        unoptimized
      />
    </motion.div>
  );
}

export default function InicioOfertaSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-[#ececec] shadow-lg border border-gray-200/60"
      aria-label="Oferta y ubicaciones"
    >
      <div className="flex gap-3 sm:gap-4 md:gap-6 px-4 sm:px-6 md:px-8 py-6 md:py-8">
        {/* Línea de tiempo lateral */}
        <aside
          className="hidden sm:flex w-10 md:w-12 shrink-0 flex-col items-center pt-1"
          aria-hidden
        >
          <TimelineNode>1</TimelineNode>
          <div className="w-px flex-1 min-h-[6rem] md:min-h-[7rem] bg-[#c4a574]/35 my-1" />
          <TimelineNode>
            <Truck className="h-4 w-4 text-gray-700" strokeWidth={2} />
          </TimelineNode>
          <div className="w-px flex-1 min-h-[5rem] md:min-h-[6rem] bg-[#c4a574]/35 my-1" />
          <TimelineNode>2</TimelineNode>
          <div className="w-px flex-1 min-h-[3rem] bg-[#c4a574]/35 my-1" />
          <TimelineNode>
            <MapPin className="h-4 w-4 text-gray-700" strokeWidth={2} />
          </TimelineNode>
        </aside>

        <div className="min-w-0 flex-1 space-y-8 md:space-y-10">
          {/* Qué vendemos */}
          <div>
            <SectionHeading>
              Qué <span className="text-[#E30613]">vendemos</span>
            </SectionHeading>

            <ul className="grid grid-cols-1 min-[420px]:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
              {productosOfrecidos.map((producto) => (
                <li key={producto.id} className="min-w-0">
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.18)] transition-shadow duration-300 hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.22)]">
                    <div className={`px-3 py-2.5 text-center ${producto.headerColor}`}>
                      <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-wide text-white leading-tight">
                        {producto.headerBar}
                      </p>
                    </div>

                    <div className="flex flex-1 flex-col p-3 sm:p-4">
                      <div className="mb-3">
                        <ProductCardIllustration
                          imagen={producto.imagen}
                          imagenClass={producto.imagenClass}
                          ringClass={producto.ringClass}
                          alt={producto.titulo}
                        />
                      </div>

                      <p className="text-center text-xs sm:text-sm font-black uppercase italic text-gray-900 leading-tight">
                        {producto.titulo}
                      </p>
                      <p className="mt-2 flex-1 text-center text-[10px] sm:text-[11px] font-medium leading-relaxed text-gray-600">
                        {producto.descripcion}
                      </p>

                      <div className="mt-4 flex items-start justify-center gap-1 border-t border-gray-100 pt-3">
                        {producto.badges.map((badge) => (
                          <ProductFooterBadge key={badge.label} icon={badge.icon} label={badge.label} />
                        ))}
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>

            <div className="mt-5 md:mt-6 flex justify-center">
              <a
                href="/combustible"
                className="group inline-flex w-full sm:w-auto min-w-[15rem] items-center justify-center gap-2 rounded-full bg-[#E30613] px-8 py-3 text-[11px] font-black uppercase tracking-[0.18em] italic text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:bg-gray-900"
              >
                Ver combustibles
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          {/* Dónde estamos */}
          <div>
            <SectionHeading>
              Dónde <span className="text-[#E30613]">estamos</span>
            </SectionHeading>

            <ul className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
              {ubicaciones.map((u) => (
                <li key={u.nombre} className="min-w-0">
                  <a
                    href={u.href}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E30613]/40 sm:flex-row"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 1px 1px, rgb(209 213 219 / 0.45) 1px, transparent 0)',
                      backgroundSize: '14px 14px',
                      backgroundColor: '#f8f8f8',
                    }}
                  >
                    <div className="relative h-36 w-full shrink-0 sm:h-auto sm:w-[42%] sm:min-h-[9.5rem]">
                      <Image
                        src={u.imagen}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 sm:to-white/40" />
                    </div>

                    <div className="flex flex-1 flex-col justify-center bg-white/85 p-4 backdrop-blur-[2px]">
                      <p className="text-sm font-black uppercase italic leading-tight text-gray-900 group-hover:text-[#E30613] transition-colors">
                        {u.nombre}
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[#E30613]">
                        {u.detalle}
                      </p>
                      <p className="mt-2 text-[10px] font-medium leading-snug text-gray-500">
                        {u.direccion}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#E30613] group-hover:text-gray-900 transition-colors">
                        Ver ubicación
                        <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
