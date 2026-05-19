'use client';

import React from 'react';
import { ArrowRight, Fuel, Briefcase, DollarSign } from 'lucide-react';
import SiteShell from '@/components/SiteShell';

const items = [
  {
    href: '/combustible',
    icon: Fuel,
    title: 'Combustibles Pemex',
    desc: 'Aditec®, gasolinas y diésel para todos los sectores.',
  },
  {
    href: '/corporativo',
    icon: Briefcase,
    title: 'Ventas Corporativas',
    desc: 'Soluciones para flotas, crédito y logística empresarial.',
  },
  {
    href: '/precios',
    icon: DollarSign,
    title: 'Precios Vigentes',
    desc: 'Consulta el tablero actualizado de precios por estación.',
  },
];

export default function Page() {
  return (
    <SiteShell>
      <section className="bg-gray-200 py-10 md:py-20 px-4 w-full overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-10 text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic leading-tight">
              Servicios <span className="text-[#E30613]">Proenergéticos</span>
            </h1>
            <p className="mt-4 text-base md:text-xl text-gray-500 font-medium">
              Elige la sección que mejor se adapta a lo que necesitas hoy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6">
            {items.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="group bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 flex flex-col items-start text-left hover:-translate-y-1 hover:shadow-2xl transition-all"
              >
                <div className="bg-red-50 rounded-2xl p-3 mb-4">
                  <item.icon className="w-6 h-6 text-[#E30613]" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter italic mb-2">
                  {item.title}
                </h2>
                <p className="text-sm md:text-base text-gray-500 font-medium mb-4">{item.desc}</p>
                <span className="mt-auto inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#E30613]">
                  Entrar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

