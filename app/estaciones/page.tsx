'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, Store, Clock, Truck, Briefcase, Fuel, 
  ChevronRight, Zap, Wind, Droplets, Bath, Info, Gauge,
  ShieldCheck, ZapIcon, BarChart3
} from 'lucide-react';
import Image from 'next/image';
import SiteShell from '@/components/SiteShell'; 

// --- COMPONENTES AUXILIARES ---

const ServiceIcon = ({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) => (
  <div className="flex items-center gap-2 bg-gray-50 px-2 py-2 rounded-xl border border-gray-100 transition-all duration-300 hover:bg-white hover:shadow-sm">
    <Icon className={`w-3.5 h-3.5 ${color}`} />
    <span className="text-[9px] font-black text-gray-700 uppercase tracking-tight leading-none">{label}</span>
  </div>
);

const EstacionCard = ({ nombre, marca, direccion, servicios, imagen, isFeatured, mapLink, estacionLogo }: any) => {
  const handleNavigation = () => {
    if (mapLink && mapLink !== '#') window.open(mapLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`bg-white rounded-[40px] shadow-xl overflow-hidden border ${isFeatured ? 'border-[#E30613] ring-4 ring-[#E30613]/5' : 'border-gray-100'} flex flex-col h-full group transition-all duration-500 hover:shadow-2xl relative`}>
      
      <div className="absolute top-4 left-6 z-20 transition-transform duration-500 group-hover:scale-110">
        <div className="relative w-30 h-17">
          <Image src={estacionLogo} alt="Logo" fill className="object-contain" unoptimized />
        </div>
      </div>

      {isFeatured && (
        <div className="absolute top-4 right-4 z-20 scale-90 md:scale-100">
          <div className="bg-[#E30613] text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <Zap className="w-3 h-3 fill-white" />
            Centro Logístico
          </div>
        </div>
      )}
      
      <div className="relative h-56 w-full overflow-hidden">
        <Image src={imagen} alt={nombre} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" unoptimized />
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
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="w-4 h-4 text-[#E30613] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 font-bold leading-snug">{direccion}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {servicios.map((s: any, i: number) => <ServiceIcon key={i} {...s} />)}
        </div>

        <div className="flex-grow flex flex-col justify-center py-2 px-6">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-3 italic text-center">
            Aceptamos tarjetas y monederos
          </p>
          <div className="relative w-full h-14 opacity-80 group-hover:opacity-100 transition-opacity">
            <Image src="/images/pagos/pago tarjetas credito.png" alt="Pagos" fill className="object-contain" />
          </div>
        </div>

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
      mapLink: 'https://maps.google.com/?cid=6818530638675163216&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNl', // Enlace real,     
      imagen: '/images/gasolinera/GSI/gsi3.jpeg', 
      estacionLogo: '/images/logotipos/BLAST.png', 
      servicios: [{ icon: Store, label: 'OXXO', color: 'text-red-600' }, { icon: Clock, label: '24/7', color: 'text-green-600' }, ...serviciosBasicos] 
    },
    { 
      nombre: 'EL POZOLE (GPO)', 
      marca: 'Estación de Servicio', 
      direccion: 'CARRETERA INTERNACIONAL SUR KM. 60 EL POZOLE, VILLA UNION, Sin.', 
      mapLink: 'https://maps.google.com/?cid=2912828460837729529&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNl', // Enlace real 
      imagen: '/images/gasolinera/GPO/GPO2.jpg', 
      estacionLogo: '/images/logotipos/GPO.png', 
      servicios: [{ icon: Store, label: 'Kiosko', color: 'text-orange-600' }, { icon: Clock, label: '24/7', color: 'text-green-600' }, ...serviciosBasicos] 
    },
    { 
      nombre: 'PLANTA DE DISTRIBUCIÓN', 
      marca: 'Centro Logístico', 
      direccion: 'Sur, México 15 1002, Urías, 82070 Mazatlán, Sin.', 
      mapLink: 'https://maps.google.com/?cid=14017863012502601436&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNl', // Enlace real 
      isFeatured: true, 
      imagen: '/images/gasolinera/PLANTA/Planta3.jpg', 
      estacionLogo: '/images/logotipos/ProEner.png', 
      servicios: [{ icon: Truck, label: 'Logística', color: 'text-blue-600' }, { icon: Briefcase, label: 'Industrial', color: 'text-[#E30613]' }, { icon: Fuel, label: 'Suministro', color: 'text-gray-700' }, { icon: Bath, label: 'Baños', color: 'text-gray-500' }] 
    },
  ];

  return (
    <SiteShell>
      <div className="py-12 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            {unidades.map((u, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <EstacionCard {...u} />
              </motion.div>
            ))}
          </div>

          {/* Banner de Digitalización: Sin la tarjeta interna, solo la imagen directa */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} className="bg-[#080808] rounded-[50px] p-8 md:p-14 text-white shadow-3xl border border-white/5 overflow-hidden relative group">
            <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
              
              <div className="flex-1 space-y-8 text-left">
                <div className="inline-flex items-center gap-2 bg-[#E30613]/10 px-5 py-2 rounded-full border border-[#E30613]/20">
                  <Info className="text-[#E30613] w-4 h-4" />
                  <span className="text-[#E30613] font-black text-[10px] uppercase tracking-[0.2em]">Aviso Oficial 2026</span>
                </div>
                
                <div>
                  <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none text-white mb-4">
                    Pago Digital Obligatorio
                  </h3>
                  <div className="flex flex-wrap gap-6 text-[#E30613] font-bold text-[10px] md:text-xs uppercase tracking-[0.3em]">
                    <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> 100% Seguro</span>
                    <span className="flex items-center gap-2"><ZapIcon className="w-4 h-4" /> Carga Rápida</span>
                    <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Control Total</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm md:text-lg font-medium leading-relaxed italic max-w-2xl border-l-4 border-[#E30613] pl-8">
                  Facilita tu carga pagando con tarjetas de crédito, débito y tus monederos de combustible preferidos. En ProEnergéticos implementamos la mejor tecnología.
                </p>
              </div>

              {/* Imagen Directa: Se eliminó el contenedor bg-white/5 y el borde interno */}
              <div className="w-full lg:w-auto flex items-center justify-center py-6">
                <div className="relative w-64 h-40 md:w-[320px] md:h-52 transition-transform duration-700 hover:scale-105">
                  <Image 
                    src="/images/pagos/pago tarjetas credito.png" 
                    alt="Métodos de Pago: VISA, MasterCard, Efecticard, TicketCar" 
                    fill 
                    className="object-contain drop-shadow-[0_20px_60px_rgba(227,6,19,0.4)]" 
                    priority 
                  />
                </div>
              </div>

            </div>
          </motion.div>
          
        </div>
      </div>
    </SiteShell>
  );
}

