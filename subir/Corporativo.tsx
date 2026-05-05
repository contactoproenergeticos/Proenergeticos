'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Briefcase, Truck, BarChart3, CreditCard, ShieldCheck, FileText, Zap, Ship, Send } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    mensaje: ''
  });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const hasNumbersInNombre = /\d/.test(formData.nombre);
  const isNombreValid = formData.nombre.trim().length >= 3 && !hasNumbersInNombre;
  const isCorreoValid = validateEmail(formData.correo);
  const isMensajeValid = formData.mensaje.trim().length >= 10;

  const isFormValid = isNombreValid && isCorreoValid && isMensajeValid;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="py-12 bg-gray-200 w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-24 px-4">
        
        {/* Hero Section con la nueva imagen de Captura.jpg */}
        <section className="relative rounded-[30px] md:rounded-[60px] overflow-hidden shadow-2xl bg-gray-900 min-h-[400px] md:min-h-[500px] flex items-center">
          <div className="absolute inset-0 opacity-40">
            <Image 
              src="https://i.postimg.cc/fb7SStTK/Captura.jpg" 
              alt="Flota Corporativa" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
          <div className="relative z-10 p-8 md:p-24 max-w-4xl">
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <div className="h-1 md:h-2 w-12 md:w-16 bg-[#E30613]"></div>
              <span className="text-sm md:text-lg font-black text-[#E30613] uppercase tracking-[0.3em] md:tracking-[0.5em]">Socio Estratégico</span>
            </div>
            <h2 className="text-3xl md:text-7xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-none uppercase italic">
              Soluciones para tu <br /> <span className="text-[#E30613]">Flota y Empresa</span>
            </h2>
            <p className="text-lg md:text-2xl text-gray-300 font-medium leading-relaxed">
              Impulsamos la productividad de tu negocio con suministro confiable y herramientas de gestión avanzada.
            </p>
          </div>
        </section>

        {/* Servicios Corporativos */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <CorporativoCard 
            icon={Zap} 
            title="Suministro Industrial" 
            desc="Diésel de alta calidad para maquinaria pesada y plantas de emergencia con entrega directa."
          />
          <CorporativoCard 
            icon={CreditCard} 
            title="Crédito Corporativo" 
            desc="Control total de consumos mediante tickets y reportes detallados para una administración impecable."
          />
          <CorporativoCard 
            icon={Truck} 
            title="Atención a Flotas" 
            desc="Servicio prioritario y trazabilidad total del combustible para mantener tu operación en movimiento."
          />
        </div>

        {/* Sección de Infraestructura y Formulario de Cotización */}
        <div className="bg-white rounded-[30px] md:rounded-[60px] p-8 md:p-20 shadow-xl border border-gray-100">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Columna de Texto e Iconos */}
            <div>
              <h3 className="text-2xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic mb-8">
                Infraestructura <span className="text-[#E30613]">Logística</span>
              </h3>
              <div className="space-y-6 md:space-y-8">
                {[
                  { icon: ShieldCheck, title: "Garantía de Calidad", desc: "Combustibles certificados que protegen la vida útil de tus motores y equipos." },
                  { icon: BarChart3, title: "Reportes Inteligentes", desc: "Analiza el rendimiento de cada unidad con datos precisos en tiempo real." },
                  { icon: Ship, title: "Suministro Marino", desc: "Atención especializada para el sector pesquero e industrial en muelle." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 md:gap-6 items-start">
                    <div className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <item.icon className="w-6 h-6 md:w-8 md:h-8 text-[#E30613]" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-black text-gray-900 tracking-tighter uppercase italic">{item.title}</h4>
                      <p className="text-sm md:text-base text-gray-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FORMULARIO DE CAPTURA (Sustituye a la imagen de Ventas Industriales) */}
            <div className="bg-gray-900 rounded-[30px] md:rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
              {/* Decoración sutil de fondo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E30613]/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              
              <div className="relative z-10">
                <p className="text-[#E30613] font-black uppercase tracking-widest text-xs mb-2 italic">Contacto Comercial</p>
                <h3 className="text-2xl font-black text-white uppercase italic mb-6">Solicitar Cotización</h3>
                
                {/* Barra de progreso visual */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="NOMBRE O EMPRESA" 
                        className={`w-full bg-white/5 border rounded-xl px-5 py-4 text-white font-bold placeholder:text-gray-600 outline-none transition-all duration-300 focus:bg-white focus:text-gray-900 ${
                          formData.nombre && !isNombreValid ? 'border-red-500' : 'border-white/10 focus:border-[#E30613]'
                        }`}
                        required
                      />
                      {formData.nombre && hasNumbersInNombre && (
                        <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic">
                          El nombre solo debe contener letras
                        </p>
                      )}
                      {formData.nombre && !hasNumbersInNombre && formData.nombre.trim().length < 3 && (
                        <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic">
                          Mínimo 3 caracteres
                        </p>
                      )}
                    </div>

                    <div>
                      <input 
                        type="email" 
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        placeholder="CORREO ELECTRÓNICO" 
                        className={`w-full bg-white/5 border rounded-xl px-5 py-4 text-white font-bold placeholder:text-gray-600 outline-none transition-all duration-300 focus:bg-white focus:text-gray-900 ${
                          formData.correo && !isCorreoValid ? 'border-red-500' : 'border-white/10 focus:border-[#E30613]'
                        }`}
                        required
                      />
                      {formData.correo && !isCorreoValid && (
                        <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic">
                          Por favor, ingresa un correo válido
                        </p>
                      )}
                    </div>

                    <div>
                      <textarea 
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        placeholder="DETALLES DE TU SOLICITUD (VOLUMEN, UBICACIÓN, ETC.)" 
                        rows={4}
                        className={`w-full bg-white/5 border rounded-xl px-5 py-4 text-white font-bold placeholder:text-gray-600 outline-none resize-none transition-all duration-300 focus:bg-white focus:text-gray-900 ${
                          formData.mensaje && !isMensajeValid ? 'border-red-500' : 'border-white/10 focus:border-[#E30613]'
                        }`}
                        required
                      ></textarea>
                      {formData.mensaje && !isMensajeValid && (
                        <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic">
                          Mínimo 10 caracteres
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    type="button"
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all duration-300 flex items-center justify-center gap-3 ${
                      'bg-[#E30613] hover:bg-white hover:text-gray-900 text-white'
                    }`}
                  >
                    <>
                      Enviar Mensaje
                      <Send size={16} />
                    </>
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}