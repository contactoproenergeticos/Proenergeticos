'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Truck, 
  BarChart3, 
  CreditCard, 
  ShieldCheck, 
  Ship, 
  Send, 
  CheckCircle2, 
  Loader2, 
  Zap, 
  XCircle 
} from 'lucide-react';
import PlantaDistribucionSection from '@/components/PlantaDistribucionSection';

const CorporativoCard = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 hover:border-[#E30613]/20 transition-all group">
    <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
      <Icon className="text-[#E30613] w-8 h-8" />
    </div>
    <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic leading-none">{title}</h4>
    <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default function Corporativo() {
  const [formData, setFormData] = useState({ nombre: '', correo: '', mensaje: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Validaciones de formulario
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const hasNumbersInNombre = /\d/.test(formData.nombre);
  const isNombreValid = formData.nombre.trim().length >= 3 && !hasNumbersInNombre;
  const isCorreoValid = validateEmail(formData.correo);
  const isMensajeValid = formData.mensaje.trim().length >= 10;
  const isFormValid = isNombreValid && isCorreoValid && isMensajeValid;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Si el usuario escribe después de un error o éxito, regresamos a 'idle'
    if (status !== 'idle' && status !== 'loading') setStatus('idle');
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setStatus('loading');

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tipo: 'COTIZACION', // Identificador para la distinción en el correo
          asunto: "Solicitud de Cotización Corporativa"
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ nombre: '', correo: '', mensaje: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      setStatus('error');
    }
  };

  return (
    <div className="py-12 bg-gray-200 w-full overflow-x-hidden font-sans relative">
      
      {/* MODAL DE ESTADO PERSONALIZADO (Reemplaza al alert básico) */}
      {(status === 'success' || status === 'error') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-8 md:p-12 max-w-sm w-full shadow-2xl text-center border-b-8 border-[#E30613] transform animate-in zoom-in-95 duration-300">
            {status === 'success' ? (
              <>
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-green-600 w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 uppercase italic mb-2">Solicitud Enviada</h3>
                <p className="text-gray-500 font-medium mb-8">Hemos recibido tu solicitud de cotización con éxito. Un asesor comercial te contactará pronto.</p>
              </>
            ) : (
              <>
                <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="text-[#E30613] w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 uppercase italic mb-2">Error de Envío</h3>
                <p className="text-gray-500 font-medium mb-8">No pudimos procesar tu solicitud en este momento. Por favor, intenta más tarde.</p>
              </>
            )}
            <button 
              onClick={() => setStatus('idle')}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all active:scale-95"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-24 px-4">
        
        {/* Hero Section */}
        <section className="relative rounded-[30px] md:rounded-[60px] overflow-hidden shadow-2xl bg-gray-900 min-h-[500px] flex items-center">
          <div className="absolute inset-0 opacity-40">
            <Image 
              src="/images/gasolinera/PLANTA/Planta1.JPG"
              alt="Planta Grupo Proenergéticos" 
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
          <div className="relative z-10 p-8 md:p-24 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-2 w-16 bg-[#E30613]"></div>
              <span className="text-lg font-black text-[#E30613] uppercase tracking-[0.5em]">Socio Estratégico</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none uppercase italic">
              Planta de <span className="text-[#E30613]">Distribución</span> <br />
              y soluciones corporativas
            </h2>
          </div>
        </section>

        <PlantaDistribucionSection />

        {/* Cards de Servicios */}
        <div className="grid md:grid-cols-3 gap-12">
          <CorporativoCard icon={Zap} title="Suministro Industrial" desc="Diésel certificado de alta calidad para tanques de autoconsumo." />
          <CorporativoCard icon={CreditCard} title="Crédito Corporativo" desc="Líneas de crédito diseñadas para optimizar el flujo de tu empresa." />
          <CorporativoCard icon={Truck} title="Atención a Flotas" desc="Cargas rápidas y seguras con trazabilidad total de consumos." />
        </div>

        {/* Formulario e Infraestructura */}
        <div className="bg-white rounded-[30px] md:rounded-[60px] p-8 md:p-20 shadow-xl border border-gray-100">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Columna Texto */}
            <div>
              <h3 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic mb-8">
                Infraestructura <span className="text-[#E30613]">Logística</span>
              </h3>
              <div className="space-y-8">
                {[
                  { icon: ShieldCheck, title: "Garantía de Calidad", desc: "Suministramos combustibles bajo las normas oficiales para proteger tus motores." },
                  { icon: BarChart3, title: "Reportes Inteligentes", desc: "Accede a datos precisos de consumo por unidad y periodo en tiempo real." },
                  { icon: Ship, title: "Suministro Marino", desc: "Logística especializada para el sector pesquero y embarcaciones en muelle." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <item.icon className="w-8 h-8 text-[#E30613]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-gray-900 uppercase italic">{item.title}</h4>
                      <p className="text-gray-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna Formulario */}
            <div className="bg-gray-900 rounded-[30px] md:rounded-[40px] p-8 md:p-10 shadow-2xl relative">
              <p className="text-[#E30613] font-black uppercase tracking-widest text-xs mb-2 italic">Contacto Comercial</p>
              <h3 className="text-2xl font-black text-white uppercase italic mb-6">Solicitar Cotización</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <input 
                  type="text" 
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="NOMBRE O EMPRESA" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold outline-none focus:bg-white focus:text-gray-900 transition-all uppercase"
                  required
                />
                <input 
                  type="email" 
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="CORREO ELECTRÓNICO" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold outline-none focus:bg-white focus:text-gray-900 transition-all"
                  required
                />
                <textarea 
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="DETALLES (VOLUMEN MENSUAL, UBICACIÓN...)" 
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold outline-none resize-none focus:bg-white focus:text-gray-900 transition-all"
                  required
                ></textarea>
                
                <button 
                  type="submit"
                  disabled={!isFormValid || status === 'loading'}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-3 ${
                    isFormValid && status !== 'loading' 
                      ? 'bg-[#E30613] text-white hover:scale-[1.02] shadow-lg shadow-[#E30613]/20' 
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {status === 'loading' ? (
                    <> <Loader2 className="animate-spin" /> PROCESANDO... </>
                  ) : (
                    <> SOLICITAR INFORMACIÓN <Send size={16} /> </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}