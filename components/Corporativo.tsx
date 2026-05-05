'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Truck, BarChart3, CreditCard, ShieldCheck, Ship, Send, CheckCircle2, AlertCircle, Loader2, Zap } from 'lucide-react';

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

  // Validaciones
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const hasNumbersInNombre = /\d/.test(formData.nombre);
  const isNombreValid = formData.nombre.trim().length >= 3 && !hasNumbersInNombre;
  const isCorreoValid = validateEmail(formData.correo);
  const isMensajeValid = formData.mensaje.trim().length >= 10;
  const isFormValid = isNombreValid && isCorreoValid && isMensajeValid;

  // EFECTO DE AUTOLIMPIEZA: Quita el mensaje tras 5 segundos si no hay interacción
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setStatus('idle');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Al escribir, reseteamos el estado a 'idle' para ocultar mensajes previos 
    // y permitir que el botón se reactive inmediatamente.
    if (status !== 'idle') {
      setStatus('idle');
    }

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
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        // Limpiamos los campos para permitir una nueva entrada
        setFormData({ nombre: '', correo: '', mensaje: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="py-12 bg-gray-200 w-full overflow-x-hidden font-sans">
      <div className="max-w-6xl mx-auto space-y-24 px-4">
        
        {/* Hero Section */}
        <section className="relative rounded-[30px] md:rounded-[60px] overflow-hidden shadow-2xl bg-gray-900 min-h-[500px] flex items-center">
          <div className="absolute inset-0 opacity-40">
            <Image 
              src="/images/gasolinera/PLANTA/Planta1.JPG"
              alt="Planta Proenergéticos" 
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
              Soluciones para tu <br /> <span className="text-[#E30613]">Flota y Empresa</span>
            </h2>
          </div>
        </section>

        {/* Cards de Servicios */}
        <div className="grid md:grid-cols-3 gap-12">
          <CorporativoCard icon={Zap} title="Suministro Industrial" desc="Diésel certificado de alta calidad." />
          <CorporativoCard icon={CreditCard} title="Crédito Corporativo" desc="Control total y reportes detallados." />
          <CorporativoCard icon={Truck} title="Atención a Flotas" desc="Servicio prioritario y trazabilidad." />
        </div>

        {/* Formulario e Info */}
        <div className="bg-white rounded-[30px] md:rounded-[60px] p-8 md:p-20 shadow-xl border border-gray-100">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div aria-label="Nuestra Infraestructura">
              <h3 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic mb-8">
                Infraestructura <span className="text-[#E30613]">Logística</span>
              </h3>
              <div className="space-y-8">
                {[
                  { icon: ShieldCheck, title: "Garantía de Calidad", desc: "Combustibles que protegen tus equipos." },
                  { icon: BarChart3, title: "Reportes Inteligentes", desc: "Datos precisos en tiempo real." },
                  { icon: Ship, title: "Suministro Marino", desc: "Atención especializada en muelle." }
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

            {/* FORMULARIO DE CONTACTO */}
            <div className="bg-gray-900 rounded-[30px] md:rounded-[40px] p-8 md:p-10 shadow-2xl relative" role="region" aria-label="Solicitud de cotización">
              <p className="text-[#E30613] font-black uppercase tracking-widest text-xs mb-2 italic">Contacto Comercial</p>
              <h3 className="text-2xl font-black text-white uppercase italic mb-6">Solicitar Cotización</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <input 
                    type="text" 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="NOMBRE O EMPRESA" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold outline-none focus:bg-white focus:text-gray-900 transition-all"
                    required
                  />
                </div>

                <div>
                  <input 
                    type="email" 
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="CORREO ELECTRÓNICO" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold outline-none focus:bg-white focus:text-gray-900 transition-all"
                    required
                  />
                </div>

                <div>
                  <textarea 
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    placeholder="DETALLES (VOLUMEN, UBICACIÓN...)" 
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold outline-none resize-none focus:bg-white focus:text-gray-900 transition-all"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  disabled={!isFormValid || status === 'loading'}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-3 ${
                    isFormValid && status !== 'loading' ? 'bg-[#E30613] text-white hover:scale-[1.02]' : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {status === 'loading' ? (
                    <> <Loader2 className="animate-spin" /> ENVIANDO... </>
                  ) : (
                    <> ENVIAR MENSAJE <Send size={16} /> </>
                  )}
                </button>

                {/* MENSAJES DE ESTADO DINÁMICOS */}
                <div aria-live="polite" className="mt-4 text-center min-h-[30px]">
                  {/* El mensaje verde desaparece si el estado cambia O si el usuario empieza a escribir (nombre != '') */}
                  {status === 'success' && formData.nombre === '' && (
                    <div className="flex items-center justify-center gap-2 text-green-400 font-bold animate-in fade-in zoom-in duration-300">
                      <CheckCircle2 size={20} /> ¡ENVIADO CON ÉXITO!
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="flex items-center justify-center gap-2 text-red-500 font-bold">
                      <AlertCircle size={20} /> ERROR AL ENVIAR. REINTENTE.
                    </div>
                  )}
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
} // Fin del componente