'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PWA_SCOPE_STORAGE_KEY } from '@/lib/pwaLaunchGuard';

function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    (typeof navigator !== 'undefined' &&
      'standalone' in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export default function PublicPwaScope() {
  const pathname = usePathname();

  useEffect(() => {
    // 🛑 TRUCO: Silencia por completo el letrero automático de instalación en móviles
    const silenceInstallPrompt = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener('beforeinstallprompt', silenceInstallPrompt);

    // Lógica original de tu PWA
    if (!isStandalonePwa()) return;
    if (pathname?.startsWith('/admin-precios')) return;

    try {
      localStorage.setItem(PWA_SCOPE_STORAGE_KEY, 'public');
    } catch {
      /* ignore */
    }

    // Limpieza del evento al desmontar
    return () => {
      window.removeEventListener('beforeinstallprompt', silenceInstallPrompt);
    };
  }, [pathname]);

  return null;
}