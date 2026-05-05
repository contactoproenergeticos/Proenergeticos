'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Store, Wifi, Clock, Wind, User, 
  Truck, Briefcase, Fuel, ChevronRight, Zap
} from 'lucide-react';
import Image from 'next/image';

// --- COMPONENTES INTERNOS ---
interface ServiceIconProps {
  icon: React.ElementType;
  label: string;
  color: string;
}

const ServiceIcon = ({ icon: Icon, label, color }: ServiceIconProps) => (
  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 group/icon hover:bg-white hover:shadow-lg transition-all duration-300">
    <div className={`p-2 rounded-lg bg-white shadow-sm ${color.replace('text-', 'bg-').replace('-600', '-50')}`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">{label}</span>
  </div>
);

const EstacionCard = ({ nombre, marca, direccion, servicios, imagen, isFeatured }: any) => (
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
        <div className="bg-red-50 p-2 rounded-lg"><MapPin className="w-6 h-6 text-[#E30613]" /></div>
        <p className="text-base text-gray-600 font-bold leading-relaxed">{direccion}</p>
      </div>
      <div className="flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {servicios.map((service: any, i: number) => (<ServiceIcon key={i} {...service} />))}
        </div>
      </div>
      <button className="w-full mt-12 py-6 bg-[#E30613] text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-gray-900 transition-all duration-300 rounded-[24px] flex items-center justify-center gap-4 group/btn">
        <span>Cómo llegar</span>
        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform" />
      </button>
    </div>
  </div>
);

// --- COMPONENTE EXPORTADO ---
export default function Estaciones({ setActiveSection }: { setActiveSection: (section: string) => void }) {
  const unidades = [
    { 
      nombre: "SANTA IRENE (GSI)", 
      marca: "Estación de Servicio",
      direccion: "Luis Donaldo Colosio Murrieta 14101, Santa Laura, 82136 Mazatlán, Sin.", 
      servicios: [
        { icon: Store, label: "OXXO", color: "text-red-600" },
        { icon: Wifi, label: "WiFi Gratis", color: "text-blue-600" },
        { icon: Clock, label: "24/7", color: "text-green-600" },
      ],
      imagen: "https://i.postimg.cc/mDJ4bVfK/gsi3.jpg"
    },
    { 
      nombre: "EL POZOLE (GPO)", 
      marca: "Estación de Servicio",
      direccion: "Carretera Internacional Sur KM. 60, El Pozole, Mazatlán, Sin.", 
      servicios: [
        { icon: Store, label: "Kiosko", color: "text-orange-600" },
        { icon: Wifi, label: "WiFi Gratis", color: "text-blue-600" },
      ],
      imagen: "https://i.postimg.cc/jqnK8Vyq/unnamed.jpg"
    },
    { 
      nombre: "PLANTA DE DISTRIBUCIÓN", 
      marca: "Centro Logístico",
      direccion: "Sur, México 15 1002, Urías, 82070 Mazatlán, Sin.", 
      isFeatured: true,
      servicios: [
        { icon: Truck, label: "Logística", color: "text-blue-600" },
        { icon: Briefcase, label: "Industrial", color: "text-[#E30613]" },
        { icon: Fuel, label: "Suministro", color: "text-gray-700" }
      ],
      imagen: "https://i.postimg.cc/yxpZ6MY8/unnamed_(4).jpg"
    }
  ];

  return (
    <div className="py-12 md:py-24 bg-gray-100 font-sans w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16 md:space-y-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {unidades.map((unidad, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <EstacionCard {...unidad} />
            </motion.div>
          ))}
        </div>

        {/* SECCIÓN DE FACTURACIÓN
        <div className="bg-gray-900 rounded-[32px] md:rounded-[64px] p-8 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-20 bg-[url('https://i.postimg.cc/yxpZ6MY8/unnamed_(4).jpg')] bg-cover bg-center grayscale"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-7xl font-black text-white uppercase italic mb-8 leading-none">
              Portal de Facturación <br /> <span className="text-[#E30613]">Electrónica</span>
            </h3>
              Facturar Ahora
            </button>
          </div> 
        </div>*/}
      </div>
    </div>
  );
}