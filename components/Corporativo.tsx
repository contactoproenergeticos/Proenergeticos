'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  Ship, 
  Send, 
  CheckCircle2, 
  Loader2, 
  Zap, 
  XCircle,
  Satellite
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
        <section className="relative w-full flex flex-col rounded-[24px] sm:rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl bg-gray-900">
          <div className="absolute inset-0 opacity-40 sm:opacity-45 md:opacity-40">
            <Image 
              src="/images/gasolinera/PLANTA/Planta1.JPG"
              alt="Planta Grupo Pro-energéticos" 
              fill
              className="object-cover object-[65%_center] sm:object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1152px"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 from-35% via-gray-900/95 via-70% to-gray-900/75 sm:from-gray-900 sm:via-gray-900/90 sm:to-gray-900/50 md:to-gray-900/40" />
          <div className="relative z-10 w-full min-w-0 px-5 pt-7 pb-5 sm:px-8 sm:pt-9 sm:pb-6 md:px-12 md:pt-11 md:pb-6 lg:px-14 lg:pt-12 lg:pb-7">
            <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl text-left">
              <h1 className="font-black text-white tracking-[-0.04em] sm:tracking-[-0.03em] md:tracking-tighter leading-[0.95] sm:leading-[0.92] uppercase italic [text-shadow:0_2px_16px_rgba(0,0,0,0.45)] text-[clamp(0.8125rem,2.9vw+0.62rem,3.25rem)]">
                <span className="block whitespace-nowrap">
                  Planta de <span className="text-[#E30613]">Distribución</span> y
                </span>
                <span className="block mt-0.5 sm:mt-1">soluciones corporativas</span>
              </h1>

              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mt-3.5 sm:mt-4 md:mt-5">
                <div className="h-0.5 sm:h-1 w-7 sm:w-8 md:w-10 bg-[#E30613] shrink-0" />
                <span className="text-[9px] sm:text-xs md:text-sm font-black text-[#E30613] uppercase tracking-[0.22em] sm:tracking-[0.3em] md:tracking-[0.4em]">
                  Socio Estratégico
                </span>
              </div>

              <h2 className="mt-3.5 sm:mt-4 md:mt-5 text-[clamp(0.72rem,2.4vw+0.45rem,1.25rem)] font-black text-white uppercase tracking-tight leading-snug max-w-full sm:max-w-xl lg:max-w-2xl">
                Soluciones corporativas para el suministro industrial
              </h2>

              <p className="mt-3 sm:mt-3.5 md:mt-4 text-[clamp(0.72rem,1.8vw+0.5rem,1rem)] text-gray-300 font-medium leading-relaxed max-w-full sm:max-w-xl lg:max-w-2xl">
                <span className="font-black text-white uppercase">Operaciones en Mazatlán:</span>{' '}
                Ofrecemos infraestructura estratégica para el suministro industrial, optimizando la
                logística de flotas y brindando atención corporativa especializada.
              </p>
            </div>

            <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-white/15">
              <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 max-w-5xl mx-auto">
                <p className="text-center text-[clamp(0.68rem,1.6vw+0.45rem,0.95rem)] sm:text-sm md:text-base text-white font-normal italic leading-snug sm:leading-relaxed max-w-3xl">
                  Nuestra flota de transporte de combustible cuenta con rastreo satelital GPS en
                  tiempo real para máxima seguridad y eficiencia.
                </p>
                <Satellite
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 shrink-0 text-white"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </div>
            </div>
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
              <div className="flex flex-col justify-center gap-10 md:gap-14">
                <div className="flex gap-5 md:gap-6 items-start">
                  <div className="bg-gray-50 p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm shrink-0">
                    <ShieldCheck className="w-8 h-8 md:w-9 md:h-9 text-[#E30613]" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-xl md:text-2xl font-black text-gray-900 uppercase italic mb-3">Garantía de Calidad</h4>
                    <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base">
                      Suministramos combustibles certificados bajo las normas oficiales de calidad, garantizando un producto confiable que protege tus motores y optimiza el rendimiento de tu operación industrial.
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 md:gap-6 items-start">
                  <div className="bg-gray-50 p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm shrink-0">
                    <Ship className="w-8 h-8 md:w-9 md:h-9 text-[#E30613]" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-xl md:text-2xl font-black text-gray-900 uppercase italic mb-3">Suministro Marino</h4>
                    <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base">
                      Logística especializada para el sector pesquero y embarcaciones en muelle, con diésel marino de alta calidad y atención directa a la flota costera de Mazatlán y la región.
                    </p>
                  </div>
                </div>
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