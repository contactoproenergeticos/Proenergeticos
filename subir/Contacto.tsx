'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Facebook, Instagram, Linkedin } from 'lucide-react';

const ContactInfo = ({ icon: Icon, title, content }: { icon: any; title: string; content: string }) => (
  // Ajuste de padding en móvil (p-5) y alineación
  <div className="flex gap-4 md:gap-6 items-start p-5 md:p-8 bg-white rounded-3xl shadow-xl border border-gray-100 transition-transform hover:scale-[1.02] w-full max-w-md mx-auto lg:mx-0">
    <div className="bg-white p-3 md:p-4 rounded-full flex-shrink-0 shadow-sm border border-gray-100">
      <Icon className="text-[#E30613] w-5 h-5 md:w-8 md:h-8" />
    </div>
    <div className="min-w-0 flex-1">
      <h4 className="text-base md:text-xl font-black text-gray-900 tracking-tighter uppercase italic mb-1 truncate">{title}</h4>
      <p className="text-gray-500 font-medium leading-tight md:leading-relaxed break-words text-[13px] md:text-base">{content}</p>
    </div>
  </div>
);

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: ''
  });

  // --- MANTENIENDO TUS VALIDACIONES ORIGINALES ---
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const hasNumbersInNombre = /\d/.test(formData.nombre);
  const isNombreValid = formData.nombre.trim().length >= 3 && !hasNumbersInNombre;
  const isCorreoValid = validateEmail(formData.correo);
  const isAsuntoValid = formData.asunto.trim().length >= 5;
  const isMensajeValid = formData.mensaje.trim().length >= 10;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="py-8 md:py-24 bg-gray-200 w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 space-y-12 md:space-y-24">
        
        {/* Encabezado: Texto dinámico para no desbordar */}
        <div className="text-center max-w-3xl mx-auto px-2">
          <h2 className="text-3xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic mb-4 md:mb-6 leading-none">
            Estamos <span className="text-[#E30613]">Contigo</span>
          </h2>
          <p className="text-sm md:text-xl text-gray-500 font-medium leading-relaxed">
            ¿Tienes alguna duda o necesitas una solución energética a medida? Nuestro equipo está listo para atenderte.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-start">
          
          {/* Formulario Estilo Corporativo Oscuro: Ajuste de padding en móvil (p-6) */}
          <div className="bg-gray-900 p-6 md:p-12 rounded-[30px] md:rounded-[60px] shadow-2xl relative overflow-hidden w-full max-w-2xl mx-auto lg:mx-0 order-1 lg:order-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E30613]/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <div className="relative z-10">
              <p className="text-[#E30613] font-black uppercase tracking-widest text-[10px] md:text-xs mb-2 italic text-center md:text-left">Canal Directo</p>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-6 md:mb-8 text-center md:text-left">Envíanos un Mensaje</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="space-y-4 md:space-y-6">
                  {/* Nombre */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nombre Completo</label>
                    <input 
                      name="nombre" value={formData.nombre} onChange={handleChange}
                      className={`w-full bg-white/5 border rounded-xl px-5 py-3.5 md:py-4 text-white font-bold text-sm outline-none transition-all duration-300 focus:bg-white focus:text-gray-900 ${
                        !formData.nombre ? 'border-white/10' : isNombreValid ? 'border-green-500' : 'border-red-500'
                      }`} 
                      placeholder="Ej. Juan Pérez" 
                    />
                    {formData.nombre && (hasNumbersInNombre || formData.nombre.trim().length < 3) && (
                      <p className="text-red-500 text-[9px] font-bold mt-1 uppercase italic ml-4">Nombre inválido</p>
                    )}
                  </div>

                  {/* Correo */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Correo Electrónico</label>
                    <input 
                      type="email" name="correo" value={formData.correo} onChange={handleChange}
                      className={`w-full bg-white/5 border rounded-xl px-5 py-3.5 md:py-4 text-white font-bold text-sm outline-none transition-all duration-300 focus:bg-white focus:text-gray-900 ${
                        !formData.correo ? 'border-white/10' : isCorreoValid ? 'border-green-500' : 'border-red-500'
                      }`} 
                      placeholder="juan@ejemplo.com" 
                    />
                  </div>

                  {/* Asunto */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Asunto</label>
                    <input 
                      name="asunto" value={formData.asunto} onChange={handleChange}
                      className={`w-full bg-white/5 border rounded-xl px-5 py-3.5 md:py-4 text-white font-bold text-sm outline-none transition-all duration-300 focus:bg-white focus:text-gray-900 ${
                        !formData.asunto ? 'border-white/10' : isAsuntoValid ? 'border-green-500' : 'border-red-500'
                      }`} 
                      placeholder="Motivo de tu mensaje" 
                    />
                  </div>

                  {/* Mensaje */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Mensaje</label>
                    <textarea 
                      name="mensaje" value={formData.mensaje} onChange={handleChange} rows={3} 
                      className={`w-full bg-white/5 border rounded-xl px-5 py-3.5 md:py-4 text-white font-bold text-sm outline-none resize-none transition-all duration-300 focus:bg-white focus:text-gray-900 ${
                        !formData.mensaje ? 'border-white/10' : isMensajeValid ? 'border-green-500' : 'border-red-500'
                      }`} 
                      placeholder="¿En qué podemos ayudarte?"
                    ></textarea>
                  </div>
                </div>

                <button 
                  type="button"
                  className={`w-full py-4 md:py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-xs md:text-sm transition-all duration-300 flex items-center justify-center gap-3 ${
                    'bg-[#E30613] text-white active:scale-95'
                  }`}
                >
                  <><Send size={16} /> Enviar Mensaje</>
                </button>
              </form>
            </div>
          </div>

          {/* Información de Contacto: Cards se apilan en móvil */}
          <div className="flex flex-col space-y-4 md:space-y-8 w-full order-2">
            <ContactInfo icon={Phone} title="Teléfono" content="+52 (669) 991 1292" />
            <ContactInfo icon={Mail} title="Correo Electrónico" content="contacto@proenergeticos.mx" />
            <ContactInfo icon={MapPin} title="Oficinas" content="Sur, México 15 1002, Urías, 82070 Mazatlán, Sin." />
            <ContactInfo icon={Clock} title="Horario" content="Lunes a Viernes: 8:00 AM - 5:00 PM" />

            <div className="p-8 md:p-12 bg-gray-900 rounded-[30px] md:rounded-[60px] text-white shadow-2xl w-full max-w-md mx-auto lg:mx-0">
              <h4 className="text-lg md:text-2xl font-black uppercase tracking-tighter italic mb-6 md:mb-8 text-center lg:text-left">Síguenos en Redes</h4>
              <div className="flex gap-4 md:gap-6 justify-center lg:justify-start">
                {[Facebook, Instagram, Linkedin].map((Social, i) => (
                  <a key={i} href="#" className="bg-white/10 p-3.5 md:p-4 rounded-2xl hover:bg-[#E30613] transition-all active:scale-90">
                    <Social className="w-6 h-6 md:w-8 md:h-8" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mapa: Optimización de altura para móvil */}
        <div className="bg-gray-200 h-[350px] md:h-[500px] rounded-[30px] md:rounded-[60px] overflow-hidden relative shadow-inner">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/mazatlanmap/1200/500')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-2xl text-center max-w-xs md:max-w-sm">
              <MapPin className="w-10 h-10 md:w-16 md:h-16 text-[#E30613] mx-auto mb-4 md:mb-6" />
              <h4 className="text-lg md:text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Visítanos</h4>
              <p className="text-[12px] md:text-base text-gray-500 font-medium mb-6 md:mb-8">Ubicados a la salida sur de la Ciudad de Mazatlán.</p>
              <button className="bg-gray-900 text-white w-full py-3.5 rounded-full font-black uppercase tracking-widest text-[9px] md:text-xs active:scale-95 transition-all">
                Google Maps
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}