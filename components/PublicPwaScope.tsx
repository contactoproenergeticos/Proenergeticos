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

/** Marca el acceso directo público cuando la PWA principal arranca fuera de /admin-precios. */
export default function PublicPwaScope() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isStandalonePwa()) return;
    if (pathname?.startsWith('/admin-precios')) return;

    try {
      localStorage.setItem(PWA_SCOPE_STORAGE_KEY, 'public');
    } catch {
      /* ignore */
    }
  }, [pathname]);

  return null;
}
