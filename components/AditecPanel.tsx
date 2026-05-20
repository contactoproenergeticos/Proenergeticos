'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Beaker,
  Droplets,
  Layers,
  Leaf,
  Shield,
  ShieldCheck,
  Sparkles,
  Waves,
  Zap,
} from 'lucide-react';


const metrics = [
  { value: '+5%', label: 'Rendimiento', sublabel: 'Metodología EPA', icon: Zap },
  { value: '83%', label: 'Limpieza', sublabel: 'en válvulas', icon: Droplets },
  { value: '99%', label: 'Protección', sublabel: 'NACE corrosión', icon: Shield },
  { value: '-5%', label: 'CO2', sublabel: 'Huella Carbono', icon: Leaf },
] as const;

const agents = [
  { title: 'Detergencia', description: 'Mantiene limpio el sistema de admisión.', icon: Sparkles },
  { title: 'Anticorrosivo', description: 'Protege contra la herrumbre.', icon: Shield },
  { title: 'Antioxidante', description: 'Evita la degradación del combustible.', icon: Leaf },
  { title: 'Solvente', description: 'Disuelve depósitos existentes.', icon: Beaker },
  { title: 'Fluido Portador', description: 'Transporta los activos eficientemente.', icon: Waves },
  { title: 'Co-Solvente', description: 'Mejora la estabilidad de la mezcla.', icon: Layers },
  { title: 'Desemulsionante', description: 'Separa el agua del combustible.', icon: Droplets },
  { title: 'Inhibidor', description: 'Reduce el desgaste del metal.', icon: ShieldCheck },
] as const;

function MetricCard({
  value,
  label,
  sublabel,
  icon: Icon,
  index,
}: {
  value: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#111827] via-[#0f172a] to-[#1e293b] p-4 md:p-6 text-center shadow-lg border border-white/5 hover:border-[#E30613]/40 transition-colors"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(227,6,19,0.12) 0%, transparent 60%)',
        }}
        aria-hidden
      />
      <div className="relative z-10">
        <div
          className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl mx-auto mb-3 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(227,6,19,0.15)', border: '1px solid rgba(227,6,19,0.25)' }}
        >
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#E30613]" />
        </div>
        <span className="block text-2xl md:text-4xl font-black text-white tracking-tighter leading-none">
          {value}
        </span>
        <span className="text-[10px] md:text-xs text-[#E30613] uppercase font-black tracking-[0.2em] block mt-2">
          {label}
        </span>
        <p className="text-[9px] md:text-[10px] text-white/45 font-semibold mt-1.5 leading-tight">
          {sublabel}
        </p>
      </div>
    </motion.div>
  );
}

function AgentCard({
  title,
  description,
  icon: Icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
}) {
  return (
    <div className="group relative">
      {/* Estela y resplandor solo por fuera */}
      <div
        className="absolute -inset-1 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[0_0_22px_rgba(227,6,19,0.35),0_0_44px_rgba(227,6,19,0.12)]"
        aria-hidden
      />
      <div
        className="absolute top-1/2 left-full h-0.5 w-0 group-hover:w-8 -translate-y-1/2 bg-gradient-to-r from-[#E30613]/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out pointer-events-none blur-[0.5px] hidden sm:block"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
        whileHover={{ y: -4, scale: 1.01 }}
        className="relative z-10 bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm overflow-hidden transition-colors duration-300 group-hover:border-2 group-hover:border-[#E30613]"
      >
        <div className="flex items-start gap-3 md:gap-4">
          <div className="flex flex-col items-center gap-2 shrink-0">
            <span className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gray-900 flex items-center justify-center text-[11px] md:text-xs font-black text-white shadow-sm">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
              <Icon className="w-4 h-4 text-[#E30613]" />
            </div>
          </div>

          <div className="min-w-0 pt-0.5">
            <h4 className="text-[#E30613] font-black text-xs md:text-sm mb-1.5 uppercase italic tracking-tight leading-tight">
              {title}
            </h4>
            <p className="text-[11px] md:text-sm text-gray-600 leading-relaxed font-medium">
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AgentsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="space-y-5 md:space-y-6 rounded-2xl md:rounded-3xl bg-gray-100/90 border border-gray-200 p-4 md:p-6"
    >
      <div className="flex items-center gap-3 md:gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-gray-300" />
        <div className="text-center px-2">
          <p className="text-[10px] md:text-xs font-black text-[#E30613] uppercase tracking-[0.3em] mb-1">
            Fórmula Aditec®
          </p>
          <h3 className="text-xs sm:text-sm md:text-base font-black text-gray-800 uppercase tracking-[0.12em] sm:tracking-[0.15em]">
            Agentes de desempeño
          </h3>
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gray-200 to-gray-300" />
      </div>

      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {agents.map((agent, i) => (
          <AgentCard key={agent.title} {...agent} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

export default function AditecPanel() {
  return (
    <div className="space-y-8 md:space-y-10">
      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-r from-[#111827] to-[#1f2937] p-4 sm:p-5 md:p-8 border border-white/5"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgba(227,6,19,0.3) 0%, transparent 50%)',
          }}
          aria-hidden
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#E30613]" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#E30613]">
                Tecnología Pemex
              </span>
            </div>
            <p className="text-base sm:text-lg md:text-2xl text-white font-medium leading-snug max-w-xl">
              Tecnología de última generación con{' '}
              <span className="text-[#E30613] font-black italic">8 agentes activos</span>.
            </p>
          </div>
          <div
            className="hidden md:flex w-20 h-20 rounded-2xl items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(227,6,19,0.2), rgba(227,6,19,0.05))',
              border: '1px solid rgba(227,6,19,0.3)',
            }}
          >
            <Zap className="w-10 h-10 text-[#E30613]" strokeWidth={1.5} />
          </div>
        </div>
      </motion.div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {metrics.map((metric, i) => (
          <MetricCard key={metric.label} {...metric} index={i} />
        ))}
      </div>

      {/* Agentes */}
      <AgentsSection />
    </div>
  );
}
