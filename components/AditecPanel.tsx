'use client';

import React from 'react';
import { Droplets, Leaf, Shield, Zap } from 'lucide-react';

const agents = [
  { title: 'Detergencia', description: 'Mantiene limpio el sistema de admisión.' },
  { title: 'Anticorrosivo', description: 'Protege contra la herrumbre.' },
  { title: 'Antioxidante', description: 'Evita la degradación del combustible.' },
  { title: 'Solvente', description: 'Disuelve depósitos existentes.' },
  { title: 'Fluido Portador', description: 'Transporta los activos eficientemente.' },
  { title: 'Co-Solvente', description: 'Mejora la estabilidad de la mezcla.' },
  { title: 'Desemulsionante', description: 'Separa el agua del combustible.' },
  { title: 'Inhibidor', description: 'Reduce el desgaste del metal.' },
] as const;

function MetricCard({
  value,
  label,
  sublabel,
  icon: Icon,
}: {
  value: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-white border border-gray-100 p-4 md:p-5 rounded-2xl text-center shadow-sm">
      <Icon className="w-5 h-5 text-[#E30613] mx-auto mb-2" />
      <span className="block text-xl md:text-3xl font-black text-[#E30613] tracking-tighter leading-none">
        {value}
      </span>
      <span className="text-[9px] md:text-[10px] text-gray-900 uppercase font-black tracking-widest block mt-1">
        {label}
      </span>
      <p className="text-[8px] md:text-[9px] text-gray-400 font-bold mt-1 leading-tight">{sublabel}</p>
    </div>
  );
}

function AgentCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-3 md:p-4 border-2 border-gray-100 rounded-2xl shadow-sm hover:border-[#E30613] transition-all min-h-[70px] w-full flex flex-col justify-center">
      <h4 className="text-[#E30613] font-black text-[9px] md:text-xs mb-1 uppercase italic tracking-tighter leading-none">
        {title}
      </h4>
      <p className="text-[8px] md:text-[10px] text-gray-500 leading-tight font-medium">{description}</p>
    </div>
  );
}

export default function AditecPanel() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center md:text-left">
        <p className="text-base md:text-lg text-gray-600 font-medium">
          Tecnología de última generación con{' '}
          <span className="text-[#E30613] font-black italic">8 agentes activos</span>.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <MetricCard value="+5%" label="Rendimiento" sublabel="Metodología EPA" icon={Zap} />
        <MetricCard value="83%" label="Limpieza" sublabel="en válvulas" icon={Droplets} />
        <MetricCard value="99%" label="Protección" sublabel="NACE corrosión" icon={Shield} />
        <MetricCard value="-5%" label="CO2" sublabel="Huella Carbono" icon={Leaf} />
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-center md:text-left">
          Agentes de desempeño
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {agents.map((agent) => (
            <AgentCard key={agent.title} {...agent} />
          ))}
        </div>
      </div>
    </div>
  );
}
