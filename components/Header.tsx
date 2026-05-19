'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  Users,
  Fuel,
  MapPin,
  Factory,
  BadgeDollarSign,
  HeartHandshake,
  MessageSquare,
  Receipt,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Impresión / PDF: con `true` se quita el “anclaje” (sticky + nav `fixed` de SiteShell) solo al imprimir.
 * Cuando ya no lo necesites: pon `false` aquí (o pídemelo) y el header vuelve a comportarse exactamente como antes de este arreglo.
 */
const HEADER_ENABLE_PRINT_UNSTICK = true;

const Header: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  /** Nodos a los que aplicamos estilos de impresión (header + contenedor fixed/sticky, p. ej. nav de SiteShell) */
  const printAdjustedRefs = useRef<HTMLElement[]>([]);

  // Menú de opciones.
  // `shortLabel` se usa en el nav de escritorio en anchos intermedios (lg) donde
  // el texto completo no cabe; el `label` completo se muestra en xl/2xl y en el
  // drawer móvil (donde hay espacio de sobra).
  // `Icon` se muestra junto a cada opción en el drawer móvil.
  const menuOptions: {
    href: string;
    label: string;
    shortLabel?: string;
    Icon: LucideIcon;
  }[] = [
    { href: '/', label: 'Inicio', Icon: Home },
    { href: '/nosotros', label: 'Nosotros', Icon: Users },
    { href: '/combustible', label: 'Combustible', Icon: Fuel },
    { href: '/estaciones', label: 'Estaciones de Servicio', shortLabel: 'Estaciones', Icon: MapPin },
    { href: '/corporativo', label: 'Planta de Distribución', shortLabel: 'Planta', Icon: Factory },
    { href: '/precios', label: 'Precios', Icon: BadgeDollarSign },
    { href: '/comunidad', label: 'Comunidad', Icon: HeartHandshake },
    { href: '/contacto', label: 'Quejas y Sugerencias', shortLabel: 'Quejas', Icon: MessageSquare },
  ];

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const handleNavClick = () => setIsDrawerOpen(false);

  // Bloquear scroll en móvil cuando el drawer está abierto
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isDrawerOpen]);

  /*
    Impresión / PDF (Chrome): el nav padre en SiteShell usa position:fixed; Chrome repite fixed en cada hoja.
    Además el header usa sticky. Aquí se neutraliza header + ancestros fixed/sticky solo al imprimir.
  */
  useEffect(() => {
    if (!HEADER_ENABLE_PRINT_UNSTICK || typeof window === 'undefined') return;

    const props = ['position', 'top', 'left', 'right', 'bottom', 'inset', 'z-index'] as const;

    const restorePrintLayout = () => {
      for (const node of printAdjustedRefs.current) {
        for (const p of props) node.style.removeProperty(p);
      }
      printAdjustedRefs.current = [];
    };

    const unstickForPrint = () => {
      restorePrintLayout();
      const start = headerRef.current;
      if (!start) return;

      const affected: HTMLElement[] = [];
      let node: HTMLElement | null = start;
      while (node) {
        const pos = window.getComputedStyle(node).position;
        if (pos === 'fixed' || pos === 'sticky') {
          node.style.setProperty('position', 'static', 'important');
          node.style.setProperty('top', 'auto', 'important');
          node.style.setProperty('left', 'auto', 'important');
          node.style.setProperty('right', 'auto', 'important');
          node.style.setProperty('bottom', 'auto', 'important');
          node.style.setProperty('inset', 'auto', 'important');
          node.style.setProperty('z-index', 'auto', 'important');
          affected.push(node);
        }
        node = node.parentElement;
      }
      printAdjustedRefs.current = affected;
    };

    window.addEventListener('beforeprint', unstickForPrint);
    window.addEventListener('afterprint', restorePrintLayout);

    const mql = window.matchMedia('print');
    const onPrintMedia = () => {
      if (mql.matches) unstickForPrint();
      else restorePrintLayout();
    };
    mql.addEventListener('change', onPrintMedia);

    return () => {
      window.removeEventListener('beforeprint', unstickForPrint);
      window.removeEventListener('afterprint', restorePrintLayout);
      mql.removeEventListener('change', onPrintMedia);
      restorePrintLayout();
    };
  }, []);

  return (
    <>
      {HEADER_ENABLE_PRINT_UNSTICK ? (
        <style
          dangerouslySetInnerHTML={{
            __html: `@media print {
            header.proenergeticos-header-print {
              position: static !important;
              top: auto !important;
              inset: auto !important;
              z-index: auto !important;
            }
          }`,
          }}
        />
      ) : null}
      <header
        ref={HEADER_ENABLE_PRINT_UNSTICK ? headerRef : undefined}
        className={`${HEADER_ENABLE_PRINT_UNSTICK ? 'proenergeticos-header-print ' : ''}sticky top-0 z-[100] w-full bg-white shadow-sm border-b border-gray-100`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-4 h-20 md:h-28 lg:h-32">
          
          {/* SECCIÓN LOGOTIPO - USANDO ProEner_negro.png sobre fondo blanco */}
          <a
            href="/"
            className="flex-shrink-0 cursor-pointer flex items-center gap-1.5 sm:gap-2 lg:gap-3"
            onClick={handleNavClick}
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20">
              <Image 
                src="/images/logotipos/ProEner_negro.png"
                alt="Logo ProEnergéticos"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center gap-0 min-w-0">
              <span className="text-[13px] sm:text-[15px] md:text-lg lg:text-2xl font-black italic tracking-tighter leading-none text-slate-900 uppercase">
                GRUPO
              </span>
              <h1 className="text-[13px] sm:text-[15px] md:text-lg lg:text-2xl font-black italic tracking-tighter leading-none text-slate-900 uppercase">
                PRO<span className="text-[#E30613]">ENERGÉTICOS</span>
              </h1>
              <span className="text-[6px] sm:text-[7px] md:text-[9px] lg:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.3em] uppercase text-gray-500 leading-tight mt-0.5">
                Sinaloa, México
              </span>
            </div>
          </a>

          {/* NAVEGACIÓN DESKTOP: una sola fila, alineada a la derecha; texto tipo oración */}
          <div className="hidden lg:flex flex-1 flex-col items-end justify-center gap-3 lg:gap-4 min-w-0 pl-2 xl:pl-4">
            <a
              href="/facturacion"
              className="bg-[#E30613] text-white font-black px-6 lg:px-8 py-2 rounded-full hover:bg-gray-900 transition-all duration-300 text-[10px] lg:text-xs tracking-[0.2em] uppercase shadow-lg active:scale-95 text-center shrink-0"
            >
              Facturación en Línea
            </a>

            <nav className="w-full min-w-0 flex justify-end overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <ul className="flex flex-nowrap items-center justify-end gap-x-2 lg:gap-x-3 xl:gap-x-5 2xl:gap-x-6 shrink-0">
                {menuOptions.map((option) => {
                  const isActive = pathname === option.href;
                  const shortLabel = option.shortLabel ?? option.label;
                  return (
                    <li key={option.href} className="shrink-0">
                      <a
                        href={option.href}
                        title={option.label}
                        className={`text-[11px] lg:text-[12px] xl:text-[14px] 2xl:text-[15px] font-black italic tracking-wide xl:tracking-wider normal-case transition-all duration-300 py-1 border-b-2 whitespace-nowrap
                          ${isActive
                            ? 'text-[#E30613] border-[#E30613]'
                            : 'text-gray-600 border-transparent hover:text-[#E30613]'}`}
                      >
                        <span className="xl:hidden">{shortLabel}</span>
                        <span className="hidden xl:inline">{option.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* CONTROLES MÓVIL */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-4">
            <a
              href="/facturacion"
              className="bg-[#E30613] text-white font-black px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[11px] uppercase tracking-widest shadow-md"
            >
              Facturación
            </a>
            <button 
              onClick={toggleDrawer}
              className="text-gray-900 p-1.5 hover:bg-gray-100 rounded-lg border border-gray-100"
              aria-label="Abrir Menú"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* DRAWER MÓVIL */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleDrawer}
              className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[110]"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed right-0 top-0 h-full w-[78%] max-w-[340px] z-[120] flex flex-col shadow-2xl border-l-4 border-[#E30613] bg-gradient-to-br from-gray-900/92 via-gray-900/88 to-black/95 backdrop-blur-2xl overflow-hidden"
            >
              {/* Línea acento superior */}
              <div
                className="pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E30613] via-red-400 to-[#E30613]"
                aria-hidden
              />
              {/* Resplandor decorativo sutil */}
              <div
                className="pointer-events-none absolute -top-24 -right-20 w-56 h-56 rounded-full bg-[#E30613]/20 blur-3xl"
                aria-hidden
              />

              {/* HEADER DEL DRAWER */}
              <div className="relative flex justify-between items-center px-4 py-4 border-b border-white/10">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative w-9 h-9 shrink-0">
                    <Image
                      src="/images/logotipos/ProEner_bco.png"
                      alt="Logo ProEnergéticos"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col leading-none min-w-0">
                    <span className="text-[15px] font-black italic tracking-tighter text-white uppercase leading-none">
                      GRUPO
                    </span>
                    <span className="text-[15px] font-black italic text-white uppercase leading-none truncate">
                      PRO<span className="text-[#E30613]">ENERGÉTICOS</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleDrawer}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors shrink-0"
                  aria-label="Cerrar menú"
                >
                  <X size={20} />
                </button>
              </div>

              {/* CTA FACTURACIÓN — siempre visible en la parte superior */}
              <div className="relative px-4 py-3 border-b border-white/10 shrink-0">
                <a
                  href="/facturacion"
                  onClick={handleNavClick}
                  className="flex items-center justify-center gap-2 w-full bg-[#E30613] hover:bg-red-700 active:scale-[0.98] text-white text-center font-black py-3 px-3 rounded-xl uppercase tracking-[0.18em] text-[11px] sm:text-xs shadow-lg shadow-red-500/30 transition-all duration-200"
                >
                  <Receipt size={15} className="shrink-0" aria-hidden />
                  <span>Facturación en Línea</span>
                </a>
              </div>

              {/* OPCIONES DEL MENÚ */}
              <nav className="relative flex-grow overflow-y-auto py-3 px-2 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
                <ul className="flex flex-col space-y-0.5">
                  {menuOptions.map((option) => {
                    const { Icon } = option;
                    const isActive = pathname === option.href;
                    return (
                      <li key={option.href}>
                        <a
                          href={option.href}
                          onClick={handleNavClick}
                          className={`group w-full py-2.5 pl-3 pr-3 rounded-lg flex items-center justify-end gap-3 normal-case font-black italic tracking-tight transition-all duration-200 text-[15px] leading-tight
                            ${isActive
                              ? 'bg-[#E30613]/15 text-[#E30613] ring-1 ring-[#E30613]/40 shadow-sm'
                              : 'text-white/85 hover:bg-white/5 hover:text-white active:bg-white/10'}`}
                        >
                          <span className="text-right break-words">{option.label}</span>
                          <span
                            className={`flex items-center justify-center w-8 h-8 rounded-md shrink-0 transition-colors
                              ${isActive
                                ? 'bg-[#E30613]/25 text-[#E30613]'
                                : 'bg-white/5 text-white/65 group-hover:bg-[#E30613]/20 group-hover:text-[#E30613]'}`}
                            aria-hidden
                          >
                            <Icon size={16} strokeWidth={2.25} />
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* PIE DECORATIVO */}
              <div className="relative px-4 py-3 border-t border-white/10 text-center">
                <p className="text-[8px] text-white/40 font-bold uppercase tracking-[0.3em]">
                  © Proenergéticos · Sinaloa
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
    </>
  );
};

export default Header;