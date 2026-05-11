'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Info, RefreshCw } from 'lucide-react';

const PrecioItem = ({ label, precio, color, subtitulo }: {
  label: string; precio: string; color: string; subtitulo: string
}) => (
  <div className="flex flex-col items-center justify-center py-4 border-b border-gray-100 last:border-0">
    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{subtitulo}</span>
    <h4 className="text-lg font-black text-gray-900 tracking-tighter uppercase italic mb-1">{label}</h4>
    <div className="flex items-baseline gap-1">
      <span className="text-xl font-black text-gray-400">$</span>
      <span className={`text-5xl font-black tracking-tighter ${color}`}>{precio}</span>
    </div>
  </div>
);

const EstacionCard = ({ 
  nombre, 
  marca, 
  borderColor, 
  precios, 
  nota, 
  logoUrl 
}: { 
  nombre: string; 
  marca: string; 
  borderColor: string; 
  precios: any[]; 
  nota: string;
  logoUrl: string;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative h-full"
  >
    <div className={`h-3 w-full ${borderColor}`}></div>
    <div className="p-6 md:p-8 flex-grow">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-10 min-h-[80px] gap-4">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter uppercase italic leading-none mb-1">
            {nombre}
          </h3>
          <p className="text-[10px] md:text-xs text-[#E30613] font-black tracking-tight uppercase">
            {marca}
          </p>
        </div>
        
        <div className="flex-1 flex justify-center items-center">
          <div className="w-24 md:w-32 h-16 md:h-20 flex items-center justify-center relative">
            <Image 
              src={logoUrl} 
              alt={marca} 
              fill
              className="object-contain scale-[1.3] md:scale-[1.6]" 
              sizes="128px"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {precios.map((p, i) => (
          <PrecioItem key={i} {...p} />
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
        <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${logoUrl.includes('BLAST') ? 'bg-amber-100 text-amber-700' : 'bg-red-50 text-[#E30613]'}`}>
          {nota}
        </div>
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Verificado CRE</span>
      </div>
    </div>
  </motion.div>
);

export default function Precios() {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const fechaActual = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        if (data && data.rates && data.rates.MXN) {
          setExchangeRate(data.rates.MXN);
        }
      } catch (error) {
        setExchangeRate(17.79);
      } finally {
        setLoading(false);
      }
    };
    fetchExchangeRate();
  }, []);

  return (
    <div className="space-y-8 md:space-y-12 py-8 md:py-12 bg-gray-200 relative w-full overflow-x-hidden">
      <div className="text-center max-w-3xl mx-auto pt-4 md:pt-8 px-4">
        <h2 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase italic mb-6">
          Tablero de <span className="text-[#E30613]">Precios</span>
        </h2>
        
        <div className="inline-flex flex-col md:flex-row items-center gap-2 md:gap-6 bg-gray-900 px-6 md:px-8 py-4 md:py-5 rounded-3xl shadow-2xl mb-8 border border-white/10">
          <div className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 md:w-5 md:h-5 ${loading ? 'animate-spin' : ''} text-[#E30613]`} />
            <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.3em]">Tipo de Cambio Oficial</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-5xl font-black text-[#E30613] tracking-tighter">
              {loading ? "---" : `$${exchangeRate?.toFixed(2)}`}
            </span>
            <span className="text-xs md:text-sm font-black text-white uppercase tracking-widest">MXN</span>
          </div>
        </div>

        <p className="text-base md:text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
          Compara los precios vigentes en nuestras estaciones de servicio en Mazatlán.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 px-4">
        <EstacionCard 
          nombre="Santa Irene (GSI)" 
          marca="Estación Blast" 
          borderColor="bg-[#E30613]" 
          precios={[
            { label: "Magna (Blast)", precio: "21.72", color: "text-green-600", subtitulo: "87 Octanos" },
            { label: "Premium (Blast)", precio: "22.68", color: "text-red-600", subtitulo: "91 Octanos" },
            { label: "Diésel", precio: "23.15", color: "text-gray-900", subtitulo: "UBA" },
          ]} 
          nota="Marca Propia"
          logoUrl="/images/logotipos/BLAST.png"
        />
        <EstacionCard 
          nombre="El Pozole (GPO)" 
          marca="Grupo Proenergéticos Oil Companies" 
          borderColor="bg-gray-900" 
          precios={[
            { label: "Gasolina Magna", precio: "22.44", color: "text-green-600", subtitulo: "Regular" },
            { label: "Gasolina Premium", precio: "24.74", color: "text-red-600", subtitulo: "Alto Octanaje" },
            { label: "Diésel", precio: "25.34", color: "text-gray-900", subtitulo: "Industrial" },
          ]} 
          nota="Garantía de Origen"
          logoUrl="/images/logotipos/ProEner_negro.png"
        />
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 flex items-start gap-6 border border-gray-100 shadow-sm mx-4">
        <Info className="text-gray-400 w-6 h-6 flex-shrink-0 mt-1" />
        <p className="text-[11px] text-gray-400 font-medium leading-relaxed uppercase tracking-wider">
          Precios sujetos a cambios sin previo aviso. Última actualización: <span className="text-gray-900 font-black">{fechaActual}</span>
        </p>
      </div>
    </div>
  );
}