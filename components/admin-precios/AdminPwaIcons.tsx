'use client';

import { useEffect } from 'react';
import { applyAdminPwaHeadIsolation } from '@/lib/adminPwaHeadIsolation';

/**
 * Refuerza en cliente el aislamiento PWA del panel admin tras la hidratación.
 * Sin MutationObserver: evita pelear con React/Next.js por nodos del <head>.
 */
export default function AdminPwaIcons() {
  useEffect(() => {
    applyAdminPwaHeadIsolation();

    const retry = window.setTimeout(() => {
      applyAdminPwaHeadIsolation();
    }, 0);

    return () => window.clearTimeout(retry);
  }, []);

  return null;
}
