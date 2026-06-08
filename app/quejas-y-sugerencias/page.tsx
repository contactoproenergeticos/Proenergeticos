'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  FileText,
  Scale,
  Fuel,
  Clock,
  ExternalLink,
} from 'lucide-react';
import SiteShell from '@/components/SiteShell';

type CategoriaBuzon = 'queja' | 'sugerencia';

const ESTACIONES = [
  { value: 'gsi', label: 'Gasolinera Santa Irene (GSI) — Mazatlán' },
  { value: 'gpo', label: 'Gasolinera El Pozole (GPO) — Villa Unión' },
  { value: 'planta', label: 'Planta de Distribución — Mazatlán' },
] as const;

const MOTIVOS_NOM = [
  { value: 'calidad', label: 'Calidad del combustible (octanaje, especificaciones NOM)' },
  { value: 'litraje', label: 'Cantidad despachada (litraje en dispensario)' },
  { value: 'diesel_uba', label: 'Diésel — contenido de azufre (UBA) u olor' },
  { value: 'precios', label: 'Precios exhibidos o publicidad en estación' },
  { value: 'facturacion', label: 'Facturación o comprobante fiscal' },
  { value: 'atencion', label: 'Atención del personal en estación' },
  { value: 'instalaciones', label: 'Instalaciones, seguridad o señalización' },
  { value: 'sugerencia', label: 'Sugerencia de mejora del servicio' },
  { value: 'otro', label: 'Otro motivo relacionado con petrolíferos' },
] as const;

/** Debe coincidir con normalizeFormTipo() en app/api/send/route.ts */
const FORM_TIPO = 'QUEJAS_SUGERENCIAS' as const;

const REQUISITOS_NOM = [
  'Buzón accesible para usuarios y consumidores de nuestras estaciones de servicio.',
  'Tratamiento de quejas y sugerencias vinculadas a la calidad de petrolíferos conforme a la NOM-016-CRE-2016.',
  'Registro de estación, fecha y dispensario para investigar incidentes en expendio al público.',
  'Respuesta orientada a la solución en un plazo razonable; te contactaremos al correo indicado.',
  'Canal complementario: no sustituye los procedimientos ante la CRE ni ante la Profeco.',
] as const;

export default function QuejasYSugerenciasPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [ultimaCategoria, setUltimaCategoria] = useState<CategoriaBuzon>('queja');
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    categoria: 'queja' as CategoriaBuzon,
    estacion: 'gsi',
    motivo: 'calidad',
    fechaHecho: '',
    horaHecho: '',
    dispensario: '',
    mensaje: '',
    aceptaAviso: false,
  });

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isNombreValid = formData.nombre.trim().length >= 3;
  const isCorreoValid = validateEmail(formData.correo);
  const isMensajeValid = formData.mensaje.trim().length >= 20;
  const isFormValid =
    isNombreValid && isCorreoValid && isMensajeValid && formData.aceptaAviso && formData.fechaHecho;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (status !== 'idle') setStatus('idle');
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    setStatus('idle');

    const etiquetaCategoria = formData.categoria === 'queja' ? 'Queja' : 'Sugerencia';
    const estacionLabel =
      ESTACIONES.find((e) => e.value === formData.estacion)?.label ?? formData.estacion;
    const motivoLabel =
      MOTIVOS_NOM.find((m) => m.value === formData.motivo)?.label ?? formData.motivo;

    setUltimaCategoria(formData.categoria);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.correo,
          telefono: formData.telefono,
          mensaje: formData.mensaje,
          tipo: FORM_TIPO,
          tipoFormulario: FORM_TIPO,
          seccion: 'quejas',
          categoria: etiquetaCategoria,
          asunto: `${etiquetaCategoria} — ${motivoLabel}`,
          estacion: estacionLabel,
          motivo: motivoLabel,
          fechaHecho: formData.fechaHecho,
          horaHecho: formData.horaHecho,
          dispensario: formData.dispensario,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          nombre: '',
          correo: '',
          telefono: '',
          categoria: 'queja',
          estacion: 'gsi',
          motivo: 'calidad',
          fechaHecho: '',
          horaHecho: '',
          dispensario: '',
          mensaje: '',
          aceptaAviso: false,
        });
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
      <div className="py-8 md:py-14 bg-gray-200 w-full overflow-x-hidden">
        {status !== 'idle' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-[40px] p-8 md:p-12 max-w-sm w-full shadow-2xl text-center border-b-8 border-[#E30613]">
              {status === 'success' ? (
                <>
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-green-600 w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase italic mb-2">
                    Registro recibido
                  </h3>
                  <p className="text-gray-500 font-medium mb-8 text-sm leading-relaxed">
                    Tu {ultimaCategoria === 'queja' ? 'queja' : 'sugerencia'} fue registrada en nuestro
                    buzón conforme a la NOM-016-CRE-2016. Te daremos seguimiento al correo proporcionado.
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
                  <p className="text-gray-500 font-medium mb-8 text-sm">
                    Intenta de nuevo o comunícate por teléfono en horario de oficina.
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

        <div className="max-w-6xl mx-auto px-4 space-y-8 md:space-y-10">
          {/* Hero */}
          <section className="relative rounded-[30px] md:rounded-[60px] overflow-hidden shadow-2xl bg-gray-950 min-h-[280px] md:min-h-[360px] flex items-center">
            <div
              className="absolute inset-0 opacity-40 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/gasolinera/GSI/gsi3.jpeg')" }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-gray-950/50" />
            <div className="relative z-10 p-8 md:p-14 lg:p-16 max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-10 bg-[#E30613]" />
                <span className="text-xs font-black text-[#E30613] uppercase tracking-[0.35em] italic">
                  NOM-016-CRE-2016
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tighter leading-[0.95] mb-4">
                Quejas y <span className="text-[#E30613]">Sugerencias</span>
              </h1>
              <p className="text-sm md:text-lg text-gray-300 font-medium leading-relaxed italic max-w-3xl">
                Buzón oficial de{' '}
                <span className="font-black uppercase italic">
                  <span className="text-white">Grupo Pro-</span>
                  <span className="text-[#E30613]">energeticos</span>
                </span>{' '}
                para reportar inconformidades o propuestas relacionadas con la calidad de petrolíferos y el
                servicio en nuestras estaciones de servicio en Mazatlán y zona conurbada.
              </p>
            </div>
          </section>

          {/* Leyenda normativa */}
          <section className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
            <div className="h-1.5 w-full bg-[#E30613]" />
            <div className="p-6 md:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                  <Scale className="w-6 h-6 text-[#E30613]" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase italic tracking-tight">
                    Marco de la <span className="text-[#E30613]">NOM-016-CRE-2016</span>
                  </h2>
                  <p className="mt-2 text-sm md:text-base text-gray-600 font-medium leading-relaxed">
                    La Norma Oficial Mexicana NOM-016-CRE-2016 establece las especificaciones de calidad de
                    los petrolíferos (gasolinas, diésel y otros) que se comercializan en México. Como
                    permisionario de expendio al público, Grupo Pro-energéticos mantiene este medio para
                    recibir quejas y sugerencias de consumidores sobre el cumplimiento de dichas
                    especificaciones, el despacho en estaciones y la atención en punto de venta.
                  </p>
                </div>
              </div>

              <ul className="grid sm:grid-cols-2 gap-3">
                {REQUISITOS_NOM.map((texto) => (
                  <li
                    key={texto}
                    className="flex gap-2 items-start text-xs md:text-sm text-gray-700 font-medium leading-snug bg-gray-50 rounded-xl p-3 border border-gray-100"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#E30613] shrink-0 mt-0.5" />
                    {texto}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Qué puedes reportar + autoridades */}
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            <section className="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-6 md:p-8">
              <h3 className="flex items-center gap-2 text-lg font-black text-gray-900 uppercase italic mb-4">
                <Fuel className="w-5 h-5 text-[#E30613]" />
                ¿Qué puedes reportar?
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 font-medium">
                {[
                  'Presunta incumplimiento de octanaje o especificaciones de Magna®, Premium® o Diésel.',
                  'Diferencias en litraje o funcionamiento de dispensarios.',
                  'Conducta del personal, condiciones de la estación o información al consumidor.',
                  'Sugerencias para mejorar la experiencia y la certeza del suministro.',
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[#E30613] font-black">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-gray-900 rounded-[2rem] shadow-lg p-6 md:p-8 text-white">
              <h3 className="flex items-center gap-2 text-lg font-black uppercase italic mb-4">
                <FileText className="w-5 h-5 text-[#E30613]" />
                Otras instancias
              </h3>
              <p className="text-sm text-gray-400 font-medium mb-4 leading-relaxed">
                Si tu caso lo requiere, también puedes acudir a las autoridades competentes:
              </p>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://www.gob.mx/cre"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#E30613] hover:text-white transition-colors"
                  >
                    Comisión Reguladora de Energía (CRE)
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.gob.mx/profeco"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#E30613] hover:text-white transition-colors"
                  >
                    Procuraduría Federal del Consumidor (Profeco)
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </li>
              </ul>
              <p className="mt-4 text-xs text-gray-500 italic">
                Consultas generales:{' '}
                <Link href="/contacto" className="text-[#E30613] font-bold hover:underline">
                  página de Contacto
                </Link>
                .
              </p>
            </section>
          </div>

          {/* Formulario */}
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 bg-gray-900 p-6 md:p-10 rounded-[30px] md:rounded-[50px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#E30613]/10 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-[#E30613]" />
                  <span className="text-[#E30613] font-black text-[10px] uppercase tracking-[0.25em]">
                    Buzón NOM-016
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-2">
                  Registra tu mensaje
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Campos marcados con * son obligatorios. Incluye la mayor información posible del hecho.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="categoria" className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                        Tipo *
                      </label>
                      <select
                        id="categoria"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-sm outline-none focus:bg-white focus:text-gray-900 cursor-pointer"
                      >
                        <option value="queja" className="text-gray-900">
                          Queja
                        </option>
                        <option value="sugerencia" className="text-gray-900">
                          Sugerencia
                        </option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="motivo" className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                        Motivo *
                      </label>
                      <select
                        id="motivo"
                        name="motivo"
                        value={formData.motivo}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-sm outline-none focus:bg-white focus:text-gray-900 cursor-pointer"
                      >
                        {MOTIVOS_NOM.map((m) => (
                          <option key={m.value} value={m.value} className="text-gray-900">
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="estacion" className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                      Estación o punto de venta *
                    </label>
                    <select
                      id="estacion"
                      name="estacion"
                      value={formData.estacion}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-sm outline-none focus:bg-white focus:text-gray-900 cursor-pointer"
                    >
                      {ESTACIONES.map((e) => (
                        <option key={e.value} value={e.value} className="text-gray-900">
                          {e.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="fechaHecho" className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                        Fecha del hecho *
                      </label>
                      <input
                        id="fechaHecho"
                        type="date"
                        name="fechaHecho"
                        required
                        value={formData.fechaHecho}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-sm outline-none focus:bg-white focus:text-gray-900 [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label htmlFor="horaHecho" className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                        Hora aprox.
                      </label>
                      <input
                        id="horaHecho"
                        type="time"
                        name="horaHecho"
                        value={formData.horaHecho}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-sm outline-none focus:bg-white focus:text-gray-900 [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label htmlFor="dispensario" className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                        No. dispensario
                      </label>
                      <input
                        id="dispensario"
                        name="dispensario"
                        value={formData.dispensario}
                        onChange={handleChange}
                        placeholder="Ej. 3"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-sm outline-none focus:bg-white focus:text-gray-900"
                      />
                    </div>
                  </div>

                  <input
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre completo *"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white font-bold text-sm outline-none focus:bg-white focus:text-gray-900"
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      type="email"
                      name="correo"
                      required
                      value={formData.correo}
                      onChange={handleChange}
                      placeholder="Correo electrónico *"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white font-bold text-sm outline-none focus:bg-white focus:text-gray-900"
                    />
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Teléfono (opcional)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white font-bold text-sm outline-none focus:bg-white focus:text-gray-900"
                    />
                  </div>
                  <textarea
                    name="mensaje"
                    required
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe los hechos: producto, comportamiento del combustible, ticket, testigos, etc. (mín. 20 caracteres) *"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white font-bold text-sm outline-none resize-none focus:bg-white focus:text-gray-900"
                  />

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="aceptaAviso"
                      checked={formData.aceptaAviso}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 rounded border-white/30 accent-[#E30613]"
                    />
                    <span className="text-[11px] text-gray-400 leading-snug group-hover:text-gray-300">
                      He leído el aviso de privacidad y entiendo que este buzón atiende asuntos vinculados a
                      petrolíferos y estaciones de Grupo Pro-energéticos conforme a la NOM-016-CRE-2016. *
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm bg-[#E30613] text-white flex items-center justify-center gap-3 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Send size={18} /> Enviar al buzón
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <aside className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100">
                <Clock className="w-8 h-8 text-[#E30613] mb-3" />
                <h4 className="font-black text-gray-900 uppercase italic text-sm mb-2">
                  Tiempo de respuesta
                </h4>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  Procuramos dar seguimiento en un plazo de hasta 15 días hábiles. Casos complejos pueden
                  requerir verificación en estación o laboratorio según la NOM.
                </p>
              </div>
              <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100">
                <AlertCircle className="w-8 h-8 text-[#E30613] mb-3" />
                <h4 className="font-black text-gray-900 uppercase italic text-sm mb-2">
                  Urgencias en estación
                </h4>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  Situaciones de riesgo inmediato: acude al personal de la estación y, si es necesario, a
                  las autoridades locales. Este formulario no reemplaza servicios de emergencia.
                </p>
              </div>
              <div className="bg-[#E30613]/10 rounded-[2rem] p-6 border border-[#E30613]/20">
                <p className="text-[10px] font-black text-[#E30613] uppercase tracking-widest mb-2">
                  Permisionario
                </p>
                <p className="text-xs text-gray-800 font-bold leading-snug">
                  Grupo Pro-energéticos — Estaciones Santa Irene (GSI), El Pozole (GPO) y Planta de
                  Distribución en Mazatlán, Sinaloa.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
