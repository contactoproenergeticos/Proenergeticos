'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Importante para la navegación interna
import { motion } from 'framer-motion';
import { 
  Info, 
  RefreshCw, 
  Receipt, 
  ChevronRight, 
  AlertCircle, 
  ShieldCheck 
} from 'lucide-react';

const PrecioItem = ({ label, precio, color, subtitulo }: {
  label: string; precio: string; color: string; subtitulo: string
}) => (
  <div className="flex flex-col items-center justify-center py-4 border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50/50">
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
    className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative h-full group"
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
          <div className="w-24 md:w-32 h-16 md:h-20 flex items-center justify-center relative transition-transform duration-500 group-hover:scale-110">
            <Image 
              src={logoUrl} 
              alt={marca} 
              fill
              className="object-contain" 
              sizes="128px"
              unoptimized={true}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {precios.map((p, i) => (
          <PrecioItem key={i} {...p} />
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${logoUrl.includes('BLAST') ? 'bg-amber-100 text-amber-700' : 'bg-red-50 text-[#E30613]'}`}>
            {nota}
          </div>
          <div className="flex items-center gap-1 text-[9px] font-black text-gray-400 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3 text-blue-500" />
            Verificado CRE
          </div>
        </div>
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
    <div className="space-y-8 md:space-y-12 py-8 md:py-16 bg-gray-200 relative w-full overflow-x-hidden">
      
      {/* HEADER: TÍTULO Y TIPO DE CAMBIO */}
      <div className="text-center max-w-3xl mx-auto pt-4 md:pt-8 px-4">
        <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase italic mb-6 leading-none">
          Tablero de <span className="text-[#E30613]">Precios</span>
        </h2>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex flex-col md:flex-row items-center gap-2 md:gap-6 bg-gray-900 px-8 py-5 rounded-[2rem] shadow-2xl mb-8 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''} text-[#E30613]`} />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Tipo de Cambio MXN/USD</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              {loading ? "---" : `$${exchangeRate?.toFixed(2)}`}
            </span>
            <span className="text-xs font-black text-[#E30613] uppercase tracking-widest">Peso Mexicano</span>
          </div>
        </motion.div>

        <p className="text-lg md:text-xl text-gray-500 font-bold leading-tight max-w-xl mx-auto uppercase tracking-tight italic">
          Combustibles de alta calidad con garantía de litraje exacto en Mazatlán.
        </p>
      </div>

      {/* GRID DE ESTACIONES */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 px-4">
        <EstacionCard 
          nombre="Santa Irene (GSI)" 
          marca="Estación Blast" 
          borderColor="border-[#E30613]" 
          precios={[
            { label: "Magna (Blast)", precio: "22.79", color: "text-green-600", subtitulo: "87 Octanos" },
            { label: "Premium (Blast)", precio: "26.39", color: "text-red-600", subtitulo: "91 Octanos" },
            { label: "Diésel", precio: "27.39", color: "text-gray-900", subtitulo: "UBA" },
          ]} 
          nota="Tecnología Alemana"
          logoUrl="/images/logotipos/BLAST.png"
        />
        <EstacionCard 
          nombre="El Pozole (GPO)" 
          marca="Grupo Proenergéticos" 
          borderColor="border-gray-900" 
          precios={[
            { label: "Gasolina Magna", precio: "23.24", color: "text-green-600", subtitulo: "Aditivada" },
            { label: "Gasolina Premium", precio: "28.98", color: "text-red-600", subtitulo: "Máximo Desempeño" },
            { label: "Diésel", precio: "25.40", color: "text-gray-900", subtitulo: "Industrial" },
          ]} 
          nota="Garantía de Origen"
          logoUrl="/images/logotipos/ProEner_negro.png"
        />
      </div>

      {/* BANNER DE FACTURACIÓN (APUNTA A TU PÁGINA INTERNA) */}
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-xl flex flex-col md:flex-row items-center gap-10"
        >
          <div className="bg-gray-900 p-6 rounded-[2.5rem] shadow-xl">
            <Receipt className="w-12 h-12 text-[#E30613]" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-4">
              Facturación <span className="text-[#E30613]">Digital</span>
            </h3>
            <p className="text-sm md:text-base text-gray-500 font-bold leading-relaxed italic max-w-xl uppercase tracking-tight">
              ¿Cargaste combustible? Genera tu factura electrónica seleccionando tu estación en nuestro portal dedicado.
            </p>
          </div>

          <Link 
            href="/facturacion" 
            className="w-full md:w-auto bg-[#E30613] hover:bg-gray-900 text-white font-black uppercase tracking-[0.2em] text-sm px-12 py-6 rounded-[2rem] flex items-center justify-center gap-4 transition-all duration-300 shadow-2xl shadow-red-500/30 group"
          >
            <span>Facturar Aquí</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* TIPS Y NOTAS FINALES */}
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-6">
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 flex items-start gap-5 border border-white/60">
          <AlertCircle className="w-8 h-8 text-[#E30613] flex-shrink-0" />
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Aviso Importante</p>
            <p className="text-xs text-gray-700 font-bold italic leading-relaxed uppercase">
              Los precios en este tablero son informativos. El precio vigente es el mostrado directamente en la pantalla de la bomba despachadora.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-3xl p-8 flex items-center gap-6 border border-white/5 shadow-2xl">
          <Info className="text-[#E30613] w-8 h-8 flex-shrink-0" />
          <p className="text-[10px] text-gray-400 font-black leading-relaxed uppercase tracking-[0.15em]">
            Actualización diaria conforme a la liberación de precios de mercado. <br/>
            <span className="text-white">Último registro: {fechaActual}</span>
          </p>
        </div>
      </div>

    </div>
  );
}