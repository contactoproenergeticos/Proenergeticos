'use client';

import React, { Suspense, useMemo } from 'react';
import { motion } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import {
  MapPin,
  Store,
  Clock,
  ChevronRight,
  Wind,
  Droplets,
  Bath,
  Info,
  Gauge,
  ShieldCheck,
  Zap as ZapIcon,
  BarChart3,
  Truck,
  Fuel,
  Building2,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import SiteShell from '@/components/SiteShell';

type ServicioItem = { icon: LucideIcon; label: string; color: string };

type EstacionId = 'gsi' | 'gpo';

type EstacionData = {
  id: EstacionId;
  nombre: string;
  marca: string;
  direccion: string;
  mapLink: string;
  coords: { lat: number; lng: number };
  imagen: string;
  estacionLogo: string;
  servicios: ServicioItem[];
};

function buildMapEmbed(lat: number, lng: number, zoom: number, satellite = false) {
  const mapType = satellite ? '&t=k' : '';
  return `https://www.google.com/maps?q=${lat},${lng}&hl=es&z=${zoom}${mapType}&output=embed`;
}

const ServiceIcon = ({ icon: Icon, label }: ServicioItem) => (
  <div className="flex items-center gap-2.5 sm:gap-3 bg-gray-200 px-3.5 py-3.5 sm:px-4 sm:py-4 rounded-full min-w-0">
    <Icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-[#E30613]" />
    <span className="text-[11px] sm:text-xs md:text-sm font-black text-gray-900 uppercase tracking-tight leading-tight">
      {label}
    </span>
  </div>
);

function EstacionCard({
  nombre,
  marca,
  direccion,
  servicios,
  imagen,
  mapLink,
  coords,
  estacionLogo,
}: EstacionData) {
  const abrirMapa = () => {
    if (mapLink) window.open(mapLink, '_blank', 'noopener,noreferrer');
  };

  const mapEmbedPuntual = buildMapEmbed(coords.lat, coords.lng, 17);
  const mapEmbedAmplio = buildMapEmbed(coords.lat, coords.lng, 14, true);

  return (
    <article className="bg-white rounded-[28px] md:rounded-[32px] shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full group transition-all duration-500 hover:shadow-2xl">
      {/* Imagen con logotipo */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-gray-100">
        <div className="absolute top-4 left-4 z-20">
          <div className="relative w-24 h-12 sm:w-28 sm:h-14">
            <Image src={estacionLogo} alt="" fill className="object-contain drop-shadow-md" unoptimized />
          </div>
        </div>
        <Image
          src={imagen}
          alt={nombre}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
      </div>

      {/* Identificación */}
      <div className="px-5 sm:px-6 pt-5 sm:pt-6">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-tight">
          {nombre}
        </h2>
        <p className="mt-1.5 text-[10px] sm:text-[11px] font-black text-[#E30613] uppercase tracking-[0.18em]">
          • {marca}
        </p>

        <div className="flex items-start gap-3 mt-4">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#E30613] flex-shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base md:text-lg text-gray-700 font-semibold leading-snug">{direccion}</p>
        </div>
      </div>

      {/* Servicios */}
      <div className="px-5 sm:px-6 pt-4 pb-5">
        <div className="grid grid-cols-2 gap-3">
          {servicios.map((s, i) => (
            <ServiceIcon key={`${s.label}-${i}`} {...s} />
          ))}
        </div>
      </div>

      {/* Pagos */}
      <div className="px-5 sm:px-6 pb-5">
        <div className="rounded-2xl bg-gray-800 px-4 py-4 sm:px-5 sm:py-5 text-center">
          <p className="text-[9px] sm:text-[10px] text-white font-black uppercase tracking-[0.22em] mb-3 sm:mb-4">
            Aceptamos tarjetas y monederos
          </p>
          <div className="relative w-full h-14 sm:h-16 mx-auto max-w-[340px] sm:max-w-none">
            <Image
              src="/images/pagos/pago tarjetas hor.png"
              alt="Métodos de pago"
              fill
              className="object-contain object-center"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="mt-auto border-t border-gray-100">
        <div className="px-5 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <p className="text-xs sm:text-sm md:text-base font-black uppercase tracking-[0.18em] text-gray-700">
            Ubicación
          </p>
          <button
            type="button"
            onClick={abrirMapa}
            className="text-xs sm:text-sm md:text-base font-black uppercase tracking-widest text-[#E30613] hover:text-gray-900 flex items-center gap-1.5 transition-colors shrink-0"
          >
            Google Maps
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1 bg-gray-200 px-1 sm:px-0">
          <div className="relative h-40 sm:h-44 bg-gray-100 overflow-hidden">
            <iframe
              title={`Ubicación puntual — ${nombre}`}
              src={mapEmbedPuntual}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="relative h-40 sm:h-44 bg-gray-100 overflow-hidden">
            <iframe
              title={`Ubicación amplia — ${nombre}`}
              src={mapEmbedAmplio}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
        <div className="px-5 sm:px-6 py-5">
          <button
            type="button"
            onClick={abrirMapa}
            className="w-full py-3.5 sm:py-4 bg-[#E30613] text-white font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-all duration-300 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 active:scale-[0.98]"
          >
            Cómo llegar
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

const serviciosBasicos: ServicioItem[] = [
  { icon: Bath, label: 'Sanitarios', color: 'text-gray-500' },
  { icon: Wind, label: 'Aire Llantas', color: 'text-blue-500' },
  { icon: Droplets, label: 'Agua Radiador', color: 'text-cyan-500' },
  { icon: Gauge, label: 'Calibración', color: 'text-red-500' },
];

const unidades: EstacionData[] = [
  {
    id: 'gsi',
    nombre: 'SANTA IRENE (GSI)',
    marca: 'Estación de Servicio',
    direccion: 'Luis Donaldo Colosio Murrieta 14101, Santa Laura, 82136 Mazatlán, Sin.',
    mapLink: 'https://maps.app.goo.gl/zErcC9Mv731aAmPRA',
    coords: { lat: 23.2561731, lng: -106.405201 },
    imagen: '/images/gasolinera/GSI/gsi3.jpeg',
    estacionLogo: '/images/logotipos/BLAST.png',
    servicios: [
      { icon: Store, label: 'TIENDA DE CONVENIENCIA', color: 'text-red-600' },
      { icon: Clock, label: '24/7', color: 'text-green-600' },
      ...serviciosBasicos,
    ],
  },
  {
    id: 'gpo',
    nombre: 'EL POZOLE (GPO)',
    marca: 'Estación de Servicio',
    direccion: 'Carretera Internacional Sur Km. 60, El Pozole, Villa Unión, Sin.',
    mapLink: 'https://maps.app.goo.gl/TYiUjwbARVfAPhp16',
    coords: { lat: 23.1926548, lng: -106.2382193 },
    imagen: '/images/gasolinera/GPO/GPO2.jpg',
    estacionLogo: '/images/logotipos/GPO.png',
    servicios: [
      { icon: Store, label: 'TIENDA DE CONVENIENCIA', color: 'text-orange-600' },
      { icon: Clock, label: '24/7', color: 'text-green-600' },
      ...serviciosBasicos,
    ],
  },
];

function EstacionesPageFallback() {
  return (
    <SiteShell>
      <div className="py-10 md:py-14 bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <div className="h-[340px] md:h-[460px] rounded-[30px] md:rounded-[60px] bg-gray-200 animate-pulse" />
          <div className="h-64 rounded-[2rem] bg-gray-200 animate-pulse" />
        </div>
      </div>
    </SiteShell>
  );
}

function EstacionesPageContent() {
  const searchParams = useSearchParams();

  const filtroEstacion = useMemo(() => {
    const raw = searchParams.get('estacion')?.toLowerCase();
    return raw === 'gsi' || raw === 'gpo' ? raw : null;
  }, [searchParams]);

  const unidadesVisibles = useMemo(
    () => (filtroEstacion ? unidades.filter((u) => u.id === filtroEstacion) : unidades),
    [filtroEstacion]
  );

  const descripcionEstaciones =
    filtroEstacion === 'gsi'
      ? 'Ubicación, servicios, formas de pago y mapa de Santa Irene (GSI).'
      : filtroEstacion === 'gpo'
        ? 'Ubicación, servicios, formas de pago y mapa de El Pozole (GPO).'
        : 'Conoce ubicación, servicios, formas de pago y mapa de cada unidad.';

  return (
    <SiteShell>
      <div className="py-10 md:py-14 bg-gray-100 min-h-screen">
        <motion.div className="max-w-6xl mx-auto px-4 space-y-12 md:space-y-16">
          {/* Presentación — estilo alineado con Nosotros / Corporativo */}
          <section className="relative rounded-[30px] md:rounded-[60px] overflow-hidden shadow-2xl bg-gray-950 min-h-[340px] md:min-h-[460px] flex items-center">
            <div
              className="absolute inset-0 opacity-45 bg-cover bg-center scale-105"
              style={{ backgroundImage: "url('/images/gasolinera/GSI/gsi3.jpeg')" }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-gray-950/40" />
            <div className="relative z-10 p-8 md:p-16 lg:p-20 max-w-4xl">
              <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-8">
                <div className="h-1 md:h-2 w-10 md:w-16 bg-[#E30613]" />
                <span className="text-xs md:text-sm font-black text-[#E30613] uppercase tracking-[0.3em] md:tracking-[0.45em] italic">
                  Red de estaciones
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-5 md:mb-6 tracking-tighter leading-[0.95] uppercase italic">
                <span className="text-white">Grupo </span>
                <span className="text-white">Pro</span>
                <span className="text-[#E30613]">energéticos</span>
              </h1>
              <p className="text-base md:text-xl text-gray-300 font-medium leading-relaxed italic max-w-3xl">
                Somos una empresa sinaloense dedicada a la{' '}
                <span className="text-white font-black not-italic">distribución de combustibles</span>{' '}
                en modalidad de <span className="text-[#E30613] font-black not-italic">mayoreo</span> y{' '}
                <span className="text-[#E30613] font-black not-italic">medio mayoreo</span>, con red propia
                de estaciones de servicio que atienden al público y a flotas en Mazatlán y la zona
                conurbada.
              </p>
            </div>
          </section>

          <div className="space-y-8 md:space-y-10">
            <div className="text-center max-w-2xl mx-auto pt-2">
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                {filtroEstacion === 'gsi' && (
                  <>
                    Estación <span className="text-[#E30613]">Santa Irene</span>
                  </>
                )}
                {filtroEstacion === 'gpo' && (
                  <>
                    Estación <span className="text-[#E30613]">El Pozole</span>
                  </>
                )}
                {!filtroEstacion && (
                  <>
                    Nuestras <span className="text-[#E30613]">Estaciones</span>
                  </>
                )}
              </h2>
              <p className="mt-3 text-sm md:text-base text-gray-500 font-medium leading-relaxed">
                {descripcionEstaciones}
              </p>
              {filtroEstacion && (
                <a
                  href="/estaciones"
                  className="inline-flex items-center gap-1.5 mt-4 text-[10px] md:text-xs font-black uppercase tracking-widest text-[#E30613] hover:text-gray-900 transition-colors"
                >
                  Ver todas las estaciones
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div
              className={`grid gap-8 lg:gap-10 items-stretch ${
                unidadesVisibles.length === 1
                  ? 'grid-cols-1 max-w-xl mx-auto'
                  : 'grid-cols-1 md:grid-cols-2'
              }`}
            >
              {unidadesVisibles.map((u, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="h-full"
                >
                  <EstacionCard {...u} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: Truck,
                title: 'Mayoreo',
                desc: 'Suministro de volumen para empresas, transportistas e industria con logística confiable.',
              },
              {
                icon: Building2,
                title: 'Medio mayoreo',
                desc: 'Soluciones flexibles para negocios y operadores que requieren cargas programadas.',
              },
              {
                icon: Fuel,
                title: 'Estaciones de servicio',
                desc: 'Atención al usuario final con combustibles de calidad, servicios y facturación digital.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100"
              >
                <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#E30613]" />
                </div>
                <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#080808] rounded-[32px] md:rounded-[50px] p-8 md:p-14 text-white shadow-2xl border border-white/5 overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 bg-[#E30613]/10 px-5 py-2 rounded-full border border-[#E30613]/20">
                  <Info className="text-[#E30613] w-4 h-4" />
                  <span className="text-[#E30613] font-black text-[10px] uppercase tracking-[0.2em]">
                    Aviso Oficial 2026
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none text-white mb-4">
                    Pago Digital Obligatorio
                  </h2>
                  <div className="flex flex-wrap gap-4 sm:gap-6 text-[#E30613] font-bold text-[10px] md:text-xs uppercase tracking-[0.25em]">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> 100% Seguro
                    </span>
                    <span className="flex items-center gap-2">
                      <ZapIcon className="w-4 h-4" /> Carga Rápida
                    </span>
                    <span className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" /> Control Total
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed italic max-w-2xl border-l-4 border-[#E30613] pl-6">
                  Facilita tu carga pagando con tarjetas de crédito, débito y tus monederos de
                  combustible preferidos. En ProEnergéticos implementamos la mejor tecnología.
                </p>
              </div>
              <div className="w-full lg:w-auto flex items-center justify-center py-4">
                <div className="relative w-64 h-40 md:w-[300px] md:h-48">
                  <Image
                    src="/images/pagos/pago tarjetas credito.png"
                    alt="Métodos de pago"
                    fill
                    className="object-contain drop-shadow-[0_20px_60px_rgba(227,6,19,0.35)]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SiteShell>
  );
}

export default function EstacionesPage() {
  return (
    <Suspense fallback={<EstacionesPageFallback />}>
      <EstacionesPageContent />
    </Suspense>
  );
}
