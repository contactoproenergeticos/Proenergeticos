'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { History, Target, Eye, Award, Users, ShieldCheck } from 'lucide-react';
import SiteShell from '@/components/SiteShell';

export default function Page() {
  return (
    <SiteShell>
      <div className="py-12 md:py-24 bg-gray-200 w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 space-y-16 md:space-y-24">
          <section className="relative rounded-[30px] md:rounded-[60px] overflow-hidden shadow-2xl bg-gray-950 min-h-[400px] md:min-h-[600px] flex items-center">
            <div
              className="absolute inset-0 opacity-50 bg-cover bg-center contrast-125 scale-105"
              style={{ backgroundImage: "url('/images/gasolinera/PLANTA/Planta4.jpg')" }}
            ></div>

            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent"></div>

            <div className="relative z-10 p-8 md:p-24 max-w-4xl">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="h-1 md:h-2 w-12 md:w-16 bg-[#E30613]"></div>
                <span className="text-sm md:text-lg font-black text-[#E30613] uppercase tracking-[0.3em] md:tracking-[0.5em] italic">Nuestra Identidad</span>
              </div>
              <h2 className="text-3xl md:text-7xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-[0.9] uppercase italic">
                Más de dos décadas <br /> <span className="text-[#E30613]">de Excelencia</span>
              </h2>
              <p className="text-lg md:text-2xl text-gray-300 font-medium leading-relaxed italic">
                En Proenergéticos S.A. de C.V., nos dedicamos a impulsar el movimiento de Mazatlán y el sur de Sinaloa con soluciones energéticas de vanguardia.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100"
            >
              <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                <Target className="text-[#E30613] w-8 h-8" />
              </div>
              <h3 className="text-4xl font-black text-[#E30613] mb-6 tracking-tighter uppercase italic">Misión</h3>
              <p className="text-lg text-gray-600 leading-relaxed font-medium italic">
                Proporcionar a todos nuestros clientes un servicio completo de calidad, oportuno y personalizado superando sus expectativas.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 p-12 rounded-[3rem] shadow-xl text-white"
            >
              <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                <Eye className="text-[#E30613] w-8 h-8" />
              </div>
              <h3 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase italic">Visión</h3>
              <p className="text-lg text-gray-400 leading-relaxed font-medium italic">
                Una ampliación en nuestras instalaciones e incorporar una nueva unidad enfocada al ramo transportista, logrando su máxima operación al año, creando mas fuentes de trabajo, desarrollandonos profesionalmente, estableciendo un compromiso de mejora continua y sirviendo a la comunidad. 
              </p>
            </motion.div>
          </div>

          <section className="pb-12">
            <div className="text-center mb-16">
              <h3 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic mb-4">Nuestros Valores</h3>
              <div className="h-1.5 w-24 bg-[#E30613] mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: ShieldCheck, title: 'Honestidad', desc: 'Litro por litro garantizado en cada carga.' },
                { icon: Award, title: 'Calidad', desc: 'Combustibles certificados bajo la NOM-016.' },
                { icon: Users, title: 'Servicio', desc: 'Atención personalizada y profesional 24/7.' },
                { icon: History, title: 'Lealtad', desc: 'Compromiso a largo plazo con nuestros clientes.' },
              ].map((valor, i) => (
                <div key={i} className="text-center group">
                  <div className="bg-white w-20 h-20 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 border border-gray-50 group-hover:scale-110 transition-all duration-500 group-hover:shadow-[#E30613]/20">
                    <valor.icon className="w-10 h-10 text-[#E30613]" />
                  </div>
                  <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-2 italic">{valor.title}</h4>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-tighter italic">{valor.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}

