'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Store, Clock, Truck, Briefcase, Fuel, 
  ChevronRight, Zap, CreditCard, Wind, Droplets, Bath 
} from 'lucide-react';
import Image from 'next/image';
import SiteShell from '@/components/SiteShell';

// --- COMPONENTES INTERNOS ---

const ServiceIcon = ({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) => (
  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 transition-all duration-300 hover:bg-white hover:shadow-sm">
    <Icon className={`w-4 h-4 ${color}`} />
    <span className="text-[9px] font-black text-gray-700 uppercase tracking-tight">{label}</span>
  </div>
);

const EstacionCard = ({ nombre, marca, direccion, servicios, imagen, isFeatured, mapLink }: any) => {
  const handleNavigation = () => {
    window.open(mapLink, '_blank');
  };

  return (
    <div className={`bg-white rounded-[40px] shadow-xl overflow-hidden border ${isFeatured ? 'border-[#E30613] ring-4 ring-[#E30613]/5' : 'border-gray-100'} flex flex-col h-full group transition-all duration-500 hover:shadow-2xl relative`}>
      
      {isFeatured && (
        <div className="absolute top-6 right-6 z-20">
          <div className="bg-[#E30613] text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <Zap className="w-3 h-3 fill-white" />
            Centro Logístico
          </div>
        </div>
      )}
      
      <div className="relative h-60 w-full overflow-hidden">
        <Image src={imagen} alt={nombre} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" unoptimized={true} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-6 left-8 text-left">
          <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-tight mb-2">{nombre}</h4>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isFeatured ? 'bg-[#E30613] animate-pulse' : 'bg-green-500'}`}></span>
            <p className="text-[10px] text-white/90 font-bold uppercase tracking-widest">{marca}</p>
          </div>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow text-left">
        <div className="flex items-start gap-3 mb-5">
          <MapPin className="w-5 h-5 text-[#E30613] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 font-bold leading-snug">{direccion}</p>
        </div>

        {/* Listado de Servicios Actualizado (Grid de 2 columnas) */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {servicios.map((service: any, i: number) => (
            <ServiceIcon key={i} {...service} />
          ))}
        </div>

        <div className="flex-grow flex flex-col justify-center py-2 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-3 italic text-center">
            Aceptamos todas las tarjetas
          </p>
          <div className="relative w-full h-16 transition-transform duration-500 group-hover:scale-105">
            <Image 
              src="/images/pagos/pago tarjetas credito.png" 
              alt="Métodos de Pago" 
              fill 
              className="object-contain" 
              priority
            />
          </div>
        </div>

        <button 
          onClick={handleNavigation}
          className="w-full mt-6 py-5 bg-[#E30613] text-white font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-all duration-300 rounded-2xl flex items-center justify-center gap-3 group/btn shadow-lg shadow-red-500/20"
        >
          <span>Cómo llegar</span>
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default function Page() {
  const unidades = [
    {
      nombre: 'SANTA IRENE (GSI)',
      marca: 'Estación de Servicio',
      direccion: 'Luis Donaldo Colosio Murrieta 14101, Santa Laura, 82136 Mazatlán, Sin.',
      mapLink: 'https://goo.gl/maps/example1',
      imagen: '/images/gasolinera/GSI/gsi3.jpeg',
      servicios: [
        { icon: Store, label: 'OXXO', color: 'text-red-600' },
        { icon: Wind, label: 'Neumáticos', color: 'text-blue-500' },
        { icon: Droplets, label: 'Agua', color: 'text-cyan-500' },
        { icon: Bath, label: 'Baños', color: 'text-gray-500' },
        { icon: Clock, label: '24/7', color: 'text-green-600' },
        { icon: Fuel, label: 'Carga Pro', color: 'text-red-600' },
      ],
    },
    {
      nombre: 'EL POZOLE (GPO)',
      marca: 'Estación de Servicio',
      direccion: 'CARRETERA INTERNACIONAL SUR KM. 60 EL POZOLE, VILLA UNION, 82275 Mazatlán, Sin.',
      mapLink: 'https://goo.gl/maps/example2',
      imagen: '/images/gasolinera/GPO/GPO2.jpg',
      servicios: [
        { icon: Store, label: 'Kiosko', color: 'text-orange-600' },
        { icon: Wind, label: 'Neumáticos', color: 'text-blue-500' },
        { icon: Droplets, label: 'Agua', color: 'text-cyan-500' },
        { icon: Bath, label: 'Baños', color: 'text-gray-500' },
        { icon: Clock, label: '24/7', color: 'text-green-600' },
        { icon: Fuel, label: 'Magna/Prem', color: 'text-green-700' },
      ],
    },
    {
      nombre: 'PLANTA DE DISTRIBUCIÓN',
      marca: 'Centro Logístico',
      direccion: 'Sur, México 15 1002, Urías, 82070 Mazatlán, Sin.',
      mapLink: 'https://goo.gl/maps/example3',
      isFeatured: true,
      imagen: '/images/gasolinera/PLANTA/Planta3.jpg',
      servicios: [
        { icon: Truck, label: 'Logística', color: 'text-blue-600' },
        { icon: Briefcase, label: 'Industrial', color: 'text-[#E30613]' },
        { icon: Fuel, label: 'Suministro', color: 'text-gray-700' },
        { icon: Bath, label: 'Baños', color: 'text-gray-500' },
      ],
    },
  ];

  return (
    <SiteShell>
      <div className="py-12 md:py-24 bg-gray-100 font-sans w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16">
          
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

          {/* Banner de Pagos */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#080808] rounded-[48px] p-8 md:p-12 text-white border border-white/5 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col-reverse lg:flex-row items-center gap-10">
              <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 bg-[#E30613]/10 px-6 py-2 rounded-full border border-[#E30613]/20">
                  <CreditCard className="text-[#E30613] w-5 h-5" />
                  <span className="text-[#E30613] font-black text-[10px] md:text-xs uppercase tracking-widest italic">Visión Digital Proener 2026</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-[0.95] mb-6">
                  Aceptamos todas las tarjetas y monederos
                </h3>
                <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed italic">
                  En 2026, México avanza hacia la eliminación del efectivo. Nos adelantamos ofreciendo tecnología sin contacto (NFC), tarjetas de crédito, débito, vales de despensa y códigos QR para mayor rapidez y seguridad.
                </p>
                <div className="pt-4 border-t border-white/10 text-left space-y-4">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed">
                    Facilitamos tu carga en cumplimiento con el Acuerdo Bancario Federal.
                  </p>
                </div>
              </div>

              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[380px] md:max-w-[420px] aspect-[16/9] bg-white rounded-[32px] p-6 shadow-2xl group border border-gray-100">
                  <Image 
                    src="/images/pagos/pago tarjetas credito.png" 
                    alt="Métodos de Pago" 
                    fill 
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
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