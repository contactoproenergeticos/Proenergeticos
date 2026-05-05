'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import SiteShell from '@/components/SiteShell';

const ContactInfo = ({ icon: Icon, title, content }: { icon: any; title: string; content: string }) => (
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

export default function Page() {
  const mapLink = 'https://maps.app.goo.gl/Cr4yHeYn3wEm9jxE8';
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    asunto: 'Contacto desde Web Proenergéticos',
    mensaje: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ nombre: '', correo: '', asunto: 'Contacto desde Web Proenergéticos', mensaje: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell>
      <div className="py-8 md:py-24 bg-gray-200 w-full overflow-x-hidden relative">
        
        {/* MODAL DE NOTIFICACIÓN PERSONALIZADO */}
        {status !== 'idle' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] p-8 md:p-12 max-w-sm w-full shadow-2xl text-center border-b-8 border-[#E30613] transform animate-in zoom-in-95 duration-300">
              {status === 'success' ? (
                <>
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-green-600 w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase italic mb-2">¡Enviado con éxito!</h3>
                  <p className="text-gray-500 font-medium mb-8">Gracias por contactarnos. Nuestro equipo te responderá muy pronto.</p>
                </>
              ) : (
                <>
                  <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="text-[#E30613] w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase italic mb-2">Hubo un error</h3>
                  <p className="text-gray-500 font-medium mb-8">No pudimos enviar tu mensaje. Por favor, inténtalo de nuevo.</p>
                </>
              )}
              <button 
                onClick={() => setStatus('idle')}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all active:scale-95"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 space-y-12 md:space-y-24">
          
          {/* ENCABEZADO */}
          <div className="text-center max-w-3xl mx-auto px-2">
            <h2 className="text-3xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic mb-4 md:mb-6 leading-none">
              Estamos <span className="text-[#E30613]">Contigo</span>
            </h2>
            <p className="text-sm md:text-xl text-gray-500 font-medium leading-relaxed">
              ¿Tienes alguna duda o necesitas una solución energética a medida? Nuestro equipo está listo para atenderte.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-stretch">
            {/* FORMULARIO */}
            <div className="bg-gray-900 p-6 md:p-12 rounded-[30px] md:rounded-[60px] shadow-2xl relative overflow-hidden flex flex-col h-full">
              <div className="relative z-10 flex flex-col h-full">
                <p className="text-[#E30613] font-black uppercase tracking-widest text-[10px] mb-2 italic">Canal Directo</p>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-8">Envíanos un Mensaje</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 flex-1 flex flex-col">
                  <input
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold text-sm outline-none focus:bg-white focus:text-gray-900 transition-all"
                    placeholder="Nombre Completo"
                  />
                  <input
                    type="email"
                    name="correo"
                    required
                    value={formData.correo}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold text-sm outline-none focus:bg-white focus:text-gray-900 transition-all"
                    placeholder="Correo Electrónico"
                  />
                  <textarea
                    name="mensaje"
                    required
                    value={formData.mensaje}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold text-sm outline-none resize-none focus:bg-white focus:text-gray-900 h-40"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 md:py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm bg-[#E30613] text-white flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <><Send size={18} /> Enviar Mensaje</>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* TARJETAS DE CONTACTO */}
            <div className="flex flex-col justify-between space-y-4 lg:space-y-0 h-full">
              <ContactInfo icon={Phone} title="Teléfono" content="+52 (669) 991 1292" />
              <ContactInfo icon={Mail} title="Correo Electrónico" content="contactoproenergeticos@gmail.com" />
              <ContactInfo icon={MapPin} title="Oficinas" content="Sur, México 15 1002, Urías, 82070 Mazatlán, Sin." />
              <ContactInfo icon={Clock} title="Horario" content="Lunes a Viernes: 8:00 AM - 5:00 PM" />
            </div>
          </div>

          {/* MAPA */}
          <div className="bg-gray-900 h-[350px] md:h-[500px] rounded-[30px] md:rounded-[60px] overflow-hidden relative shadow-inner">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{ backgroundImage: "url('/images/gasolinera/GPO/GPO2.jpg')" }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-2xl text-center max-w-xs md:max-w-sm">
                <MapPin className="w-10 h-10 md:w-16 md:h-16 text-[#E30613] mx-auto mb-4" />
                <h4 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Visítanos</h4>
                <p className="text-sm md:text-base text-gray-500 font-medium mb-6">Ubicados a la salida sur de la Ciudad de Mazatlán.</p>
                <a 
                  href={mapLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-900 text-white py-4 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-gray-800 transition-all text-center"
                >
                  Abrir Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}