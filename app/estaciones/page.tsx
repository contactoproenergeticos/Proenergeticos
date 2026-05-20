'use client';

import React from 'react';
import { motion } from 'motion/react';
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

type EstacionData = {
  nombre: string;
  marca: string;
  direccion: string;
  mapLink: string;
  mapEmbed: string;
  imagen: string;
  estacionLogo: string;
  servicios: ServicioItem[];
};

const ServiceIcon = ({ icon: Icon, label, color }: ServicioItem) => (
  <div className="flex items-center gap-2 bg-gray-50 px-2 py-2 rounded-xl border border-gray-100">
    <Icon className={`w-3.5 h-3.5 shrink-0 ${color}`} />
    <span className="text-[9px] font-black text-gray-700 uppercase tracking-tight leading-none">
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
  mapEmbed,
  estacionLogo,
}: EstacionData) {
  const abrirMapa = () => {
    if (mapLink) window.open(mapLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="bg-white rounded-[32px] md:rounded-[40px] shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full group transition-all duration-500 hover:shadow-2xl">
      {/* Imagen + título */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-left">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter italic leading-tight mb-1">
            {nombre}
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
            <p className="text-[10px] text-white/90 font-bold uppercase tracking-widest">{marca}</p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 text-left">
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="w-4 h-4 text-[#E30613] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 font-bold leading-snug">{direccion}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {servicios.map((s, i) => (
            <ServiceIcon key={`${s.label}-${i}`} {...s} />
          ))}
        </div>

        <div className="mb-5">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-2 italic text-center">
            Aceptamos tarjetas y monederos
          </p>
          <div className="relative w-full h-12 sm:h-14">
            <Image
              src="/images/pagos/pago tarjetas credito.png"
              alt="Métodos de pago"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Mapa embebido — pie de la tarjeta */}
        <div className="mt-auto -mx-5 sm:-mx-6 border-t border-gray-100">
          <div className="px-5 sm:px-6 py-3 flex items-center justify-between gap-2 bg-gray-50">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              Ubicación
            </p>
            <button
              type="button"
              onClick={abrirMapa}
              className="text-[10px] font-black uppercase tracking-widest text-[#E30613] hover:text-gray-900 flex items-center gap-1 transition-colors"
            >
              Google Maps
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="relative w-full h-44 sm:h-48 bg-gray-100">
            <iframe
              title={`Mapa — ${nombre}`}
              src={mapEmbed}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="p-4 sm:p-5 bg-white">
            <button
              type="button"
              onClick={abrirMapa}
              className="w-full py-4 bg-[#E30613] text-white font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-all duration-300 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 active:scale-[0.98]"
            >
              Cómo llegar
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function EstacionesPage() {
  const serviciosBasicos: ServicioItem[] = [
    { icon: Bath, label: 'Sanitarios', color: 'text-gray-500' },
    { icon: Wind, label: 'Aire Llantas', color: 'text-blue-500' },
    { icon: Droplets, label: 'Agua Radiador', color: 'text-cyan-500' },
    { icon: Gauge, label: 'Calibración', color: 'text-red-500' },
  ];

  const unidades: EstacionData[] = [
    {
      nombre: 'SANTA IRENE (GSI)',
      marca: 'Estación de Servicio',
      direccion: 'Luis Donaldo Colosio Murrieta 14101, Santa Laura, 82136 Mazatlán, Sin.',
      mapLink:
        'https://maps.google.com/?cid=6818530638675163216&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNl',
      mapEmbed:
        'https://www.google.com/maps?q=Luis+Donaldo+Colosio+Murrieta+14101,+Santa+Laura,+82136+Mazatl%C3%A1n,+Sin.&output=embed',
      imagen: '/images/gasolinera/GSI/gsi3.jpeg',
      estacionLogo: '/images/logotipos/BLAST.png',
      servicios: [
        { icon: Store, label: 'OXXO', color: 'text-red-600' },
        { icon: Clock, label: '24/7', color: 'text-green-600' },
        ...serviciosBasicos,
      ],
    },
    {
      nombre: 'EL POZOLE (GPO)',
      marca: 'Estación de Servicio',
      direccion: 'Carretera Internacional Sur Km. 60, El Pozole, Villa Unión, Sin.',
      mapLink:
        'https://maps.google.com/?cid=2912828460837729529&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNl',
      mapEmbed:
        'https://www.google.com/maps?q=Carretera+Internacional+Sur+Km+60,+El+Pozole,+Villa+Uni%C3%B3n,+Sinaloa,+M%C3%A9xico&output=embed',
      imagen: '/images/gasolinera/GPO/GPO2.jpg',
      estacionLogo: '/images/logotipos/GPO.png',
      servicios: [
        { icon: Store, label: 'Kiosko', color: 'text-orange-600' },
        { icon: Clock, label: '24/7', color: 'text-green-600' },
        ...serviciosBasicos,
      ],
    },
  ];

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
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-5 md:mb-6 tracking-tighter leading-[0.95] uppercase italic">
                Grupo <span className="text-[#E30613]">Proenergéticos</span>
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

          <div className="text-center max-w-2xl mx-auto pt-2">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
              Nuestras <span className="text-[#E30613]">Estaciones</span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-500 font-medium leading-relaxed">
              Conoce ubicación, servicios, formas de pago y mapa de cada unidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            {unidades.map((u, i) => (
              <motion.div
                key={u.nombre}
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
