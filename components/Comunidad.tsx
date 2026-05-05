'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowRight, Heart, Newspaper, MessageCircle } from 'lucide-react';
import Image from 'next/image';

const NoticiaCard = ({ fecha, titulo, extracto, imagen, categoria }: { fecha: string; titulo: string; extracto: string; imagen: string; categoria: string }) => (
  <div className="bg-white border border-black rounded-none overflow-hidden flex flex-col h-full group transition-all hover:shadow-2xl">
    <div className="relative h-48 w-full overflow-hidden">
      <Image 
        src={imagen} 
        alt={titulo} 
        fill 
        className="object-cover group-hover:scale-110 transition-transform duration-700"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 left-4">
        <span className="bg-[#E30613] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1">
          {categoria}
        </span>
      </div>
    </div>
    <div className="p-8 flex flex-col flex-grow">
      <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">
        <Calendar className="w-3 h-3" />
        {fecha}
      </div>
      <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-4 leading-tight group-hover:text-[#E30613] transition-colors">
        {titulo}
      </h4>
      <p className="text-sm text-gray-500 font-medium mb-8 flex-grow leading-relaxed">
        {extracto}
      </p>
      <button className="flex items-center gap-2 text-[#E30613] font-black uppercase tracking-widest text-[10px] group/btn">
        Leer más <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
      </button>
    </div>
  </div>
);

export default function Comunidad() {
  const noticias = [
    {
      fecha: "06 MARZO, 2026",
      titulo: "Apoyo a la Parroquia local: Remodelación del Atrio",
      extracto: "Como parte de nuestro compromiso social, Proenergéticos se suma a la iniciativa de mejora de espacios comunitarios.",
      imagen: "https://picsum.photos/seed/church/800/600",
      categoria: "Social"
    },
    {
      fecha: "04 MARZO, 2026",
      titulo: "Reflexión: La fe como motor de la honestidad empresarial",
      extracto: "Una breve meditación sobre cómo nuestros valores espirituales guían cada litro que entregamos.",
      imagen: "https://picsum.photos/seed/faith/800/600",
      categoria: "Espiritualidad"
    },
    {
      fecha: "01 MARZO, 2026",
      titulo: "Nuevas becas para hijos de colaboradores",
      extracto: "Iniciamos el ciclo 2026 de nuestro programa de excelencia académica para la familia Proenergéticos.",
      imagen: "https://picsum.photos/seed/education/800/600",
      categoria: "Comunidad"
    }
  ];

  return (
    <div className="py-12 md:py-24 bg-gray-200 w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 space-y-16 md:space-y-24">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-1 w-12 bg-[#E30613]"></div>
              <span className="text-xs md:text-sm font-black text-[#E30613] uppercase tracking-[0.3em] md:tracking-[0.5em]">Valores y Fe</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
              Comunidad <br /> <span className="text-[#E30613]">y Valores</span>
            </h2>
          </div>
          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-md leading-relaxed">
            Nuestra identidad está forjada en la fe y el compromiso con nuestra gente en Mazatlán.
          </p>
        </div>

        {/* Grid de Noticias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {noticias.map((noticia, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <NoticiaCard {...noticia} />
            </motion.div>
          ))}
        </div>

        {/* Sección de Reflexión Destacada */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
          <div className="bg-white border border-black p-8 md:p-12 flex flex-col justify-center">
            <div className="bg-red-50 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-6 md:mb-8">
              <Heart className="text-[#E30613] w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter italic mb-6">Reflexión del Día</h3>
            <p className="text-lg md:text-xl text-gray-600 font-medium italic leading-relaxed mb-8">
              &quot;El trabajo bien hecho es una forma de oración. Servir con honestidad es honrar la confianza que la comunidad deposita en nosotros.&quot;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 overflow-hidden relative">
                <Image src="https://picsum.photos/seed/priest/100/100" alt="Reflexión" fill className="object-cover" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-black text-gray-900 uppercase tracking-widest">Pbro. Martínez</p>
                <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Colaborador Espiritual</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-8 md:p-12 flex flex-col justify-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://picsum.photos/seed/community/800/600')] bg-cover bg-center"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic mb-6">Novedades Parroquiales</h3>
              <p className="text-gray-400 font-medium mb-8 md:mb-10 leading-relaxed">
                Mantente informado sobre las actividades, eventos y necesidades de nuestra comunidad parroquial aliada.
              </p>
              <div className="space-y-4 mb-8 md:mb-10">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <div className="text-[#E30613] font-black text-xl md:text-2xl">15</div>
                  <div className="text-xs md:text-sm font-bold uppercase tracking-widest">Marzo - Kermesse Anual Pro-Templo</div>
                </div>
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <div className="text-[#E30613] font-black text-xl md:text-2xl">22</div>
                  <div className="text-xs md:text-sm font-bold uppercase tracking-widest">Marzo - Jornada de Salud Comunitaria</div>
                </div>
              </div>
              <button className="w-full py-4 md:py-5 bg-[#E30613] text-white font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-white hover:text-gray-900 transition-all shadow-xl">
                Ver más noticias
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
