'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, ArrowRight 
} from 'lucide-react';
import Image from 'next/image';

// Importación de componentes
import Header from '@/components/Header';
import Combustibles from '@/components/Combustibles';
import Nosotros from '@/components/Nosotros';
import Estaciones from '@/components/Estaciones';
import Corporativo from '@/components/Corporativo';
import Precios from '@/components/Precios';
import Comunidad from '@/components/Comunidad';
import Contacto from '@/components/Contacto';

type Seccion = 'inicio' | 'nosotros' | 'combustible' | 'estaciones' | 'corporativo' | 'precios' | 'comunidad' | 'contacto' | 'facturacion';

export default function Page() {
  const [seccion, setSeccion] = useState<Seccion>('inicio');

  const menuOptions: { id: Seccion; label: string }[] = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'nosotros', label: 'Nosotros' },
    { id: 'combustible', label: 'Combustible' },
    { id: 'estaciones', label: 'Estaciones' },
    { id: 'corporativo', label: 'Corporativo' },
    { id: 'precios', label: 'Precios' },
    { id: 'comunidad', label: 'Comunidad' },
    { id: 'contacto', label: 'Contacto' },
  ];

  const renderContent = () => {
    switch (seccion) {
      case 'inicio':
        return (
          <div className="w-full max-w-full overflow-hidden min-h-[85vh] flex items-center justify-center p-4 md:p-8 lg:p-12 bg-gray-200">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-7xl h-[80vh] bg-gray-950 rounded-[3rem] overflow-hidden shadow-2xl flex items-center"
            >
              <div className="absolute inset-0 z-0">
                <Image 
                  src="https://i.postimg.cc/vBznk1Jc/unnamed-2.jpg"
                  alt="Planta"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  className="object-cover opacity-60 contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
              </div>

              <div className="relative z-20 w-full px-6 md:px-16 lg:px-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-[2px] w-12 bg-[#E30613]"></div>
                  <span className="text-[#E30613] text-sm font-black uppercase tracking-[0.4em] italic">— LÍDERES EN MAZATLÁN —</span>
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12 mb-8">
                  <h1 className="text-3xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
                    ENERGÍA QUE <br />
                    <span className="text-[#E30613]">MUEVE</span> A MÉXICO
                  </h1>
                  <Image 
                    src="https://i.postimg.cc/mDbp1BDF/proenergeicos_imagen.png"
                    alt="Logo Hero"
                    width={320}
                    height={120}
                    className="h-20 md:h-36 w-auto object-contain drop-shadow-2xl"
                  />
                </div>

                <p className="max-w-xl text-base md:text-lg text-white/90 font-medium italic mb-10">
                  Suministro confiable de combustibles de alta calidad para el sector transporte, industrial y marino.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto">
                  <button onClick={() => setSeccion('combustible')} className="w-full sm:w-auto bg-[#E30613] text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all group">
                    <span>Nuestros Productos</span>
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                  <button onClick={() => setSeccion('estaciones')} className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                    Ver Estaciones
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        );
      case 'nosotros': return <Nosotros />;
      case 'combustible': return <Combustibles />;
      case 'estaciones': return <Estaciones />;
      case 'corporativo': return <Corporativo />;
      case 'precios': return <Precios />;
      case 'comunidad': return <Comunidad />;
      case 'contacto': return <Contacto />;

      /* --- NUEVA SECCIÓN DE FACTURACIÓN --- */
      case 'facturacion':
        return (
          <div className="w-full min-h-[70vh] flex items-center justify-center p-4 md:p-6 bg-gray-200">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 md:p-20 rounded-[3rem] md:rounded-[4rem] shadow-2xl max-w-4xl w-full text-center border-b-[12px] border-[#E30613]"
            >
              <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-6 rounded-3xl">
                   <Image src="https://i.postimg.cc/4x1q0QJt/proenergeicos.png" alt="Logo" width={60} height={80} className="object-contain" />
                </div>
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-gray-950 mb-6 tracking-tighter uppercase italic leading-none">
                PORTAL DE <br />
                <span className="text-[#E30613]">FACTURACIÓN</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-500 font-bold mb-10 uppercase italic tracking-widest">
                Genera y consulta tus facturas de forma inmediata
              </p>
              
              <a 
                href="https://facturacion.proenergeticos.com" // Asegúrate de que este link sea el correcto
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-gray-950 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#E30613] transition-all shadow-xl hover:-translate-y-1 active:scale-95"
              >
                INGRESAR AL SISTEMA
              </a>
            </motion.div>
          </div>
        );
      /* ------------------------------------ */

      default: return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-200 font-sans overflow-x-hidden">
      <Header />

      <main className="flex-grow pt-4 px-4 md:px-0 w-full max-w-screen-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={seccion} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-[#121212] text-white py-16 px-6 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-8">
              <p className="text-gray-400 text-sm leading-relaxed font-medium italic">
                Líderes en el suministro de combustibles de alta calidad en Mazatlán, Sinaloa. Comprometidos con la excelencia y el servicio litro por litro.
              </p>
              <Image src="https://i.postimg.cc/4N0XZF3t/PRODUCTOS_FOOTER.png" alt="Pemex" width={260} height={70} className="opacity-90" />
            </div>

            <div>
              <h4 className="text-[#E30613] font-black uppercase tracking-widest text-sm mb-8 italic">Servicios</h4>
              <ul className="space-y-4 text-gray-400 text-[13px] font-bold uppercase italic tracking-tighter">
                <li><button onClick={() => setSeccion('combustible')} className="hover:text-white transition-colors">Combustibles Pemex</button></li>
                <li><button onClick={() => setSeccion('estaciones')} className="hover:text-white transition-colors">Estaciones de Servicio</button></li>
                <li><button onClick={() => setSeccion('corporativo')} className="hover:text-white transition-colors">Ventas Corporativas</button></li>
                <li><button onClick={() => setSeccion('facturacion')} className="hover:text-white transition-colors">Facturación en Línea</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#E30613] font-black uppercase tracking-widest text-sm mb-8 italic">Nosotros</h4>
              <ul className="space-y-4 text-gray-400 text-[13px] font-bold uppercase italic tracking-tighter mb-8">
                <li><button onClick={() => setSeccion('nosotros')} className="hover:text-white transition-colors">Nuestra Historia</button></li>
                <li><button onClick={() => setSeccion('precios')} className="hover:text-white transition-colors">Precios Vigentes</button></li>
                <li><button onClick={() => setSeccion('comunidad')} className="hover:text-white transition-colors">Comunidad</button></li>
                <li><button onClick={() => setSeccion('contacto')} className="hover:text-white transition-colors">Contacto</button></li>
              </ul>
              <Image src="https://i.postimg.cc/c4YYcDsf/BLAST.png" alt="Blast" width={100} height={40} className="opacity-80" />
            </div>

            <div className="space-y-10">
              <div>
                <h4 className="text-[#E30613] font-black uppercase tracking-widest text-sm mb-6 italic">Llámanos</h4>
                <div className="flex items-center gap-3 text-white font-black text-xl italic">
                  <Phone className="w-6 h-6 text-[#E30613]" fill="#E30613" />
                  <span>+52 (669) 991 1292</span>
                </div>
              </div>
              <div className="relative w-20 h-24">
                <Image src="https://i.postimg.cc/4x1q0QJt/proenergeicos.png" alt="Escudo Footer" fill sizes="200px" className="object-contain" />
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">
            <p>© 2026 PROENERGÉTICOS S.A. DE C.V. — MAZATLÁN, SINALOA</p>
            <p>CUMPLIMIENTO NOM-016-CRE-2016</p>
          </div>
        </div>
      </footer>
    </div>
  );
}