'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Store, Clock, Truck, Briefcase, Fuel, 
  ChevronRight, Zap, Wind, Droplets, Bath, Info, Gauge 
} from 'lucide-react';
import Image from 'next/image';
import SiteShell from '@/components/SiteShell'; 

// --- COMPONENTES AUXILIARES DE LA TARJETA ---

const ServiceIcon = ({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) => (
  <div className="flex items-center gap-2 bg-gray-50 px-2 py-2 rounded-xl border border-gray-100 transition-all duration-300 hover:bg-white hover:shadow-sm">
    <Icon className={`w-3.5 h-3.5 ${color}`} />
    <span className="text-[9px] font-black text-gray-700 uppercase tracking-tight leading-none">{label}</span>
  </div>
);

const EstacionCard = ({ nombre, marca, direccion, servicios, imagen, isFeatured, mapLink }: any) => {
  const handleNavigation = () => {
    if (mapLink && mapLink !== '#') window.open(mapLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`bg-white rounded-[40px] shadow-xl overflow-hidden border ${isFeatured ? 'border-[#E30613] ring-4 ring-[#E30613]/5' : 'border-gray-100'} flex flex-col h-full group transition-all duration-500 hover:shadow-2xl relative`}>
      {isFeatured && (
        <div className="absolute top-4 right-4 z-20 scale-90 md:scale-100">
          <div className="bg-[#E30613] text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <Zap className="w-3 h-3 fill-white" />
            Centro Logístico
          </div>
        </div>
      )}
      
      {/* Imagen Principal */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image src={imagen} alt={nombre} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" unoptimized={true} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-4 left-6 text-left">
          <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-tight mb-1">{nombre}</h4>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isFeatured ? 'bg-[#E30613] animate-pulse' : 'bg-green-500'}`}></span>
            <p className="text-[10px] text-white/90 font-bold uppercase tracking-widest">{marca}</p>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow text-left">
        {/* Dirección */}
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="w-4 h-4 text-[#E30613] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 font-bold leading-snug">{direccion}</p>
        </div>

        {/* Servicios */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {servicios.map((service: any, i: number) => <ServiceIcon key={i} {...service} />)}
        </div>

        {/* ANUNCIO DE TARJETAS (MÁS GRANDE) */}
        <div className="flex-grow flex flex-col justify-center py-4 border-t border-gray-100 bg-gray-50/50 -mx-6 px-6">
          <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] mb-3 italic text-center">
            Aceptamos todas las tarjetas
          </p>
          <div className="relative w-full h-20 transition-transform duration-500 group-hover:scale-110">
            <Image 
              src="/images/pagos/pago tarjetas credito.png" 
              alt="Métodos de Pago" 
              fill 
              className="object-contain" 
              priority 
            />
          </div>
        </div>

        {/* Botón */}
        <button onClick={handleNavigation} className="w-full mt-6 py-5 bg-[#E30613] text-white font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-all duration-300 rounded-2xl flex items-center justify-center gap-3 group/btn shadow-lg shadow-red-500/20">
          <span>Cómo llegar</span>
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default function EstacionesPage() {
  const serviciosBasicos = [
    { icon: Bath, label: 'Sanitarios', color: 'text-gray-500' },
    { icon: Wind, label: 'Aire Llantas', color: 'text-blue-500' },
    { icon: Droplets, label: 'Agua Radiador', color: 'text-cyan-500' },
    { icon: Gauge, label: 'Calibración', color: 'text-red-500' }
  ];

  const unidades = [
    { 
      nombre: 'SANTA IRENE (GSI)', 
      marca: 'Estación de Servicio', 
      direccion: 'Luis Donaldo Colosio Murrieta 14101, Santa Laura, 82136 Mazatlán, Sin.', 
      mapLink: 'https://maps.google.com', 
      imagen: '/images/gasolinera/GSI/gsi3.jpeg', 
      servicios: [
        { icon: Store, label: 'OXXO', color: 'text-red-600' },
        { icon: Clock, label: '24/7', color: 'text-green-600' },
        ...serviciosBasicos
      ] 
    },
    { 
      nombre: 'EL POZOLE (GPO)', 
      marca: 'Estación de Servicio', 
      direccion: 'CARRETERA INTERNACIONAL SUR KM. 60 EL POZOLE, VILLA UNION, Sin.', 
      mapLink: 'https://maps.google.com', 
      imagen: '/images/gasolinera/GPO/GPO2.jpg', 
      servicios: [
        { icon: Store, label: 'Kiosko', color: 'text-orange-600' },
        { icon: Clock, label: '24/7', color: 'text-green-600' },
        ...serviciosBasicos
      ] 
    },
    { 
      nombre: 'PLANTA DE DISTRIBUCIÓN', 
      marca: 'Centro Logístico', 
      direccion: 'Sur, México 15 1002, Urías, 82070 Mazatlán, Sin.', 
      mapLink: 'https://maps.google.com', 
      isFeatured: true, 
      imagen: '/images/gasolinera/PLANTA/Planta3.jpg', 
      servicios: [
        { icon: Truck, label: 'Logística', color: 'text-blue-600' },
        { icon: Briefcase, label: 'Industrial', color: 'text-[#E30613]' },
        { icon: Fuel, label: 'Suministro', color: 'text-gray-700' },
        { icon: Bath, label: 'Baños', color: 'text-gray-500' }
      ] 
    },
  ];

  return (
    <SiteShell>
      <div className="py-12 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            {unidades.map((u, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <EstacionCard {...u} />
              </motion.div>
            ))}
          </div>

          {/* Banner de Digitalización */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} className="bg-[#080808] rounded-[40px] p-8 md:p-10 text-white shadow-2xl border border-white/5 overflow-hidden relative">
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="flex-1 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 bg-[#E30613]/10 px-4 py-2 rounded-full border border-[#E30613]/20">
                  <Info className="text-[#E30613] w-4 h-4" />
                  <span className="text-[#E30613] font-black text-[10px] uppercase tracking-widest">Aviso Oficial 2026</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter leading-none text-white">Pago Digital Obligatorio</h3>
                <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed italic max-w-2xl">
                  Para finales de 2026, por disposición oficial, las gasolineras en México transicionarán al pago 100% digital. En ProEnergéticos nos adelantamos implementando <b>NFC, CoDi y Billeteras Móviles</b> para eliminar el efectivo.
                </p>
              </div>
              <div className="w-full md:w-auto flex flex-col items-center gap-4">
                <div className="relative w-64 h-36 bg-white rounded-3xl p-4 shadow-xl">
                  <Image src="/images/pagos/pago tarjetas credito.png" alt="Pagos" fill className="object-contain p-2" priority />
                </div>
                <span className="bg-[#E30613] text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full">Ley de Digitalización</span>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </SiteShell>
  );
}