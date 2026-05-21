'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const VISIT_SESSION_KEY = 'proener-visit-session';
const VISIT_REGISTERED_KEY = 'proener-visit-registered';

/**
 * Registra una visita pública por sesión de navegador (cualquier sección del sitio).
 * No se monta en /admin-precios (SiteShell no envuelve el panel admin).
 */
export default function PublicVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin-precios')) return;
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(VISIT_REGISTERED_KEY) === '1') return;

    let sessionKey = sessionStorage.getItem(VISIT_SESSION_KEY);
    if (!sessionKey) {
      sessionKey =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `v-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      sessionStorage.setItem(VISIT_SESSION_KEY, sessionKey);
    }

    fetch('/api/visitas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionKey, path: pathname }),
      keepalive: true,
    })
      .then(async (res) => {
        const json = await res.json();
        if (json.ok) sessionStorage.setItem(VISIT_REGISTERED_KEY, '1');
      })
      .catch(() => {
        /* ignore: no bloquear UX */
      });
  }, [pathname]);

  return null;
}
