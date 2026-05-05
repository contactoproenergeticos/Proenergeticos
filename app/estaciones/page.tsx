'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Store, Wifi, Clock, Truck, Briefcase, Fuel, ChevronRight, Zap } from 'lucide-react';
import Image from 'next/image';
import SiteShell from '@/components/SiteShell';

// --- COMPONENTES INTERNOS ---
const ServiceIcon = ({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) => (
  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 group/icon hover:bg-white hover:shadow-lg transition-all duration-300">
    <div className={`p-2 rounded-lg bg-white shadow-sm ${color.replace('text-', 'bg-').replace('-600', '-50')}`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">{label}</span>
  </div>
);

const EstacionCard = ({ nombre, marca, direccion, servicios, imagen, isFeatured, mapLink }: any) => {
  
  const handleNavigation = () => {
    // Abre el enlace directo de Google Maps proporcionado
    window.open(mapLink, '_blank');
  };

  return (
    <div className={`bg-white rounded-[48px] shadow-xl overflow-hidden border ${isFeatured ? 'border-[#E30613] ring-4 ring-[#E30613]/5' : 'border-gray-100'} flex flex-col h-full group transition-all duration-500 hover:shadow-2xl relative`}>
      {isFeatured && (
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-[#E30613] text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2">
            <Zap className="w-3 h-3 fill-white" />
            Centro Logístico
          </div>
        </div>
      )}
      
      <div className="relative h-72 w-full overflow-hidden">
        <Image src={imagen} alt={nombre} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" unoptimized={true} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute bottom-8 left-10">
          <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none mb-3">{nombre}</h4>
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${isFeatured ? 'bg-[#E30613] animate-pulse' : 'bg-green-500'}`}></span>
            <p className="text-sm text-white/80 font-bold uppercase tracking-widest">{marca}</p>
          </div>
        </div>
      </div>

      <div className="p-10 flex flex-col flex-grow">
        <div className="flex items-start gap-4 mb-10">
          <div className="bg-red-50 p-2 rounded-lg">
            <MapPin className="w-6 h-6 text-[#E30613]" />
          </div>
          <p className="text-base text-gray-600 font-bold leading-relaxed">{direccion}</p>
        </div>

        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {servicios.map((service: any, i: number) => (
              <ServiceIcon key={i} {...service} />
            ))}
          </div>
        </div>

        <button 
          onClick={handleNavigation}
          className="w-full mt-12 py-6 bg-[#E30613] text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-gray-900 transition-all duration-300 rounded-[24px] flex items-center justify-center gap-4 group/btn shadow-lg shadow-red-500/20"
        >
          <span>Cómo llegar</span>
          <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---
export default function Page() {
  const unidades = [
    {
      nombre: 'SANTA IRENE (GSI)',
      marca: 'Estación de Servicio',
      direccion: 'Luis Donaldo Colosio Murrieta 14101, Santa Laura, 82136 Mazatlán, Sin.',
      mapLink: 'https://maps.app.goo.gl/73arugQtqmd41x6B7', // Link GSI corregido
      servicios: [
        { icon: Store, label: 'OXXO', color: 'text-red-600' },
        { icon: Wifi, label: 'WiFi Gratis', color: 'text-blue-600' },
        { icon: Clock, label: '24/7', color: 'text-green-600' },
      ],
      imagen: '/images/gasolinera/GSI/gsi3.jpeg',
    },
    {
      nombre: 'EL POZOLE (GPO)',
      marca: 'Estación de Servicio',
      direccion: 'CARRETETA INTERNACIONAL SUR KM. 60 EL POZOLE, VILLA UNION, 82275 Mazatlán, Sin.',
      mapLink: 'https://maps.app.goo.gl/Pt2diuy6kjcVvGMp7', // Link GPO corregido
      servicios: [
        { icon: Store, label: 'Kiosko', color: 'text-orange-600' },
        { icon: Wifi, label: 'WiFi Gratis', color: 'text-blue-600' },
      ],
      imagen: '/images/gasolinera/GPO/GPO2.jpg',
    },
    {
      nombre: 'PLANTA DE DISTRIBUCIÓN',
      marca: 'Centro Logístico',
      direccion: 'Sur, México 15 1002, Urías, 82070 Mazatlán, Sin.',
      mapLink: 'https://maps.app.goo.gl/Cr4yHeYn3wEm9jxE8',
      isFeatured: true,
      servicios: [
        { icon: Truck, label: 'Logística', color: 'text-blue-600' },
        { icon: Briefcase, label: 'Industrial', color: 'text-[#E30613]' },
        { icon: Fuel, label: 'Suministro', color: 'text-gray-700' },
      ],
      imagen: '/images/gasolinera/PLANTA/Planta3.jpg',
    },
  ];

  return (
    <SiteShell>
      <div className="py-12 md:py-24 bg-gray-100 font-sans w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16 md:space-y-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            {unidades.map((unidad, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
              >
                <EstacionCard {...unidad} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}