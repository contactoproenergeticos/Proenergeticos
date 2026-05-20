'use client';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import SiteShell from '@/components/SiteShell';

const ContactInfo = ({
  icon: Icon,
  title,
  content,
}: {
  icon: React.ElementType;
  title: string;
  content: string;
}) => (
  <div className="flex gap-4 md:gap-6 items-start p-5 md:p-8 bg-white rounded-3xl shadow-xl border border-gray-100 transition-transform hover:scale-[1.02] w-full max-w-md mx-auto lg:mx-0">
    <div className="bg-red-50 p-3 md:p-4 rounded-full flex-shrink-0 shadow-sm border border-red-100">
      <Icon className="text-[#E30613] w-5 h-5 md:w-8 md:h-8" />
    </div>
    <div className="min-w-0 flex-1">
      <h4 className="text-base md:text-xl font-black text-gray-900 tracking-tighter uppercase italic mb-1">
        {title}
      </h4>
      <p className="text-gray-500 font-medium leading-tight md:leading-relaxed break-words text-[13px] md:text-base">
        {content}
      </p>
    </div>
  </div>
);

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: '',
  });

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const hasNumbersInNombre = /\d/.test(formData.nombre);
  const isNombreValid = formData.nombre.trim().length >= 3 && !hasNumbersInNombre;
  const isCorreoValid = validateEmail(formData.correo);
  const isAsuntoValid = formData.asunto.trim().length >= 5;
  const isMensajeValid = formData.mensaje.trim().length >= 10;
  const isFormValid = isNombreValid && isCorreoValid && isAsuntoValid && isMensajeValid;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (status !== 'idle') setStatus('idle');
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tipo: 'CONTACTO',
          asunto: formData.asunto,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ nombre: '', correo: '', asunto: '', mensaje: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell>
      <div className="py-8 md:py-24 bg-gray-200 w-full overflow-x-hidden relative">
        {status !== 'idle' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-[40px] p-8 md:p-12 max-w-sm w-full shadow-2xl text-center border-b-8 border-[#E30613]">
              {status === 'success' ? (
                <>
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-green-600 w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase italic mb-2">
                    Mensaje enviado
                  </h3>
                  <p className="text-gray-500 font-medium mb-8">
                    Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos a la brevedad.
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="text-[#E30613] w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase italic mb-2">
                    No se pudo enviar
                  </h3>
                  <p className="text-gray-500 font-medium mb-8">
                    Hubo un problema al enviar tu mensaje. Intenta de nuevo en unos minutos.
                  </p>
                </>
              )}
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all active:scale-95"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 space-y-12 md:space-y-16">
          <div className="text-center max-w-3xl mx-auto px-2">
            <div className="inline-flex items-center gap-2 bg-[#E30613]/10 px-4 py-2 rounded-full border border-[#E30613]/20 mb-4">
              <Mail className="w-4 h-4 text-[#E30613]" />
              <span className="text-[#E30613] font-black text-[10px] uppercase tracking-[0.25em]">
                Canal de contacto
              </span>
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic mb-4 md:mb-6 leading-none">
              Estamos <span className="text-[#E30613]">Contigo</span>
            </h1>
            <p className="text-sm md:text-xl text-gray-500 font-medium leading-relaxed">
              ¿Tienes alguna duda o necesitas una solución energética a medida? Nuestro equipo está listo
              para atenderte en horario de oficina.
            </p>
            <p className="mt-3 text-xs md:text-sm text-gray-400 font-medium italic">
              Para quejas o sugerencias relacionadas con combustibles y estaciones de servicio, utiliza el{' '}
              <a href="/quejas-y-sugerencias" className="text-[#E30613] font-bold hover:underline">
                buzón conforme a la NOM-016-CRE-2016
              </a>
              .
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-stretch">
            <div className="bg-gray-900 p-6 md:p-12 rounded-[30px] md:rounded-[60px] shadow-2xl relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#E30613]/15 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                <p className="text-[#E30613] font-black uppercase tracking-widest text-[10px] mb-2 italic">
                  Canal directo
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-6 md:mb-8">
                  Envíanos un mensaje
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 flex-1 flex flex-col">
                  <input
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold text-sm outline-none focus:bg-white focus:text-gray-900 transition-all"
                    placeholder="Nombre completo"
                  />
                  <input
                    type="email"
                    name="correo"
                    required
                    value={formData.correo}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold text-sm outline-none focus:bg-white focus:text-gray-900 transition-all"
                    placeholder="Correo electrónico"
                  />
                  <input
                    name="asunto"
                    required
                    value={formData.asunto}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold text-sm outline-none focus:bg-white focus:text-gray-900 transition-all"
                    placeholder="Asunto"
                  />
                  <textarea
                    name="mensaje"
                    required
                    value={formData.mensaje}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold text-sm outline-none resize-none focus:bg-white focus:text-gray-900 min-h-[140px]"
                    placeholder="¿En qué podemos ayudarte?"
                  />

                  <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="w-full py-4 md:py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm bg-[#E30613] text-white flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Send size={18} /> Enviar mensaje
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-4 lg:space-y-5 h-full">
              <ContactInfo icon={Phone} title="Teléfono" content="+52 (669) 991 1292" />
              <ContactInfo icon={Mail} title="Correo electrónico" content="contactoproenergeticos@gmail.com" />
              <ContactInfo
                icon={MapPin}
                title="Oficinas corporativas"
                content="Sur, México 15 1002, Urías, 82070 Mazatlán, Sin."
              />
              <ContactInfo icon={Clock} title="Horario" content="Lunes a Viernes: 8:00 AM - 5:00 PM" />
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
