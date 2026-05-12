'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
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

  // Menú de opciones
  const menuOptions = [
    { href: '/', label: 'Inicio' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/combustible', label: 'Combustible' },
    { href: '/estaciones', label: 'Estaciones' },
    { href: '/corporativo', label: 'Corporativo' },
    { href: '/precios', label: 'Precios' },
    { href: '/comunidad', label: 'Comunidad' },
    { href: '/contacto', label: 'Contacto' },
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
              <ul className="flex flex-nowrap items-center justify-end gap-x-3 lg:gap-x-4 xl:gap-x-5 shrink-0">
                {menuOptions.map((option) => {
                  const isActive = pathname === option.href;
                  return (
                    <li key={option.href} className="shrink-0">
                      <a
                        href={option.href}
                        className={`text-[12px] lg:text-[15px] font-black italic tracking-wider normal-case transition-all duration-300 py-1 border-b-2 whitespace-nowrap
                          ${isActive 
                            ? 'text-[#E30613] border-[#E30613]' 
                            : 'text-gray-600 border-transparent hover:text-[#E30613]'}`}
                      >
                        {option.label}
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[85%] max-w-sm bg-white z-[120] shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <div className="flex items-center gap-2 min-w-0">
                  <Image src="/images/logotipos/ProEner_negro.png" alt="Logo" width={40} height={40} className="h-10 w-auto" />
                  <div className="flex flex-col leading-none">
                    <span className="text-lg font-black italic tracking-tighter text-slate-900 uppercase leading-none">
                      GRUPO
                    </span>
                    <span className="text-lg font-black italic text-slate-900 uppercase leading-none">
                      PRO<span className="text-[#E30613]">ENERGÉTICOS</span>
                    </span>
                  </div>
                </div>
                <button onClick={toggleDrawer} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-grow overflow-y-auto py-8 px-8 text-right">
                <ul className="flex flex-col space-y-2">
                  {menuOptions.map((option) => {
                    const isActive = pathname === option.href;
                    return (
                      <li key={option.href}>
                        <a
                          href={option.href}
                          onClick={handleNavClick}
                          className={`w-full py-4 text-2xl font-black italic tracking-tighter flex items-center justify-end gap-4 normal-case
                            ${isActive ? 'text-[#E30613]' : 'text-gray-600'}`}
                        >
                          {option.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <a
                  href="/facturacion"
                  onClick={handleNavClick}
                  className="block w-full bg-[#E30613] text-white text-center font-black py-4 rounded-xl uppercase tracking-widest text-sm"
                >
                  Facturación en Línea
                </a>
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