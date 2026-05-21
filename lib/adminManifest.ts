import type { MetadataRoute } from 'next';
import {
  ADMIN_PWA_ICON,
  ADMIN_PWA_START_URL,
  ADMIN_PWA_THEME,
  ADMIN_PWA_TITLE,
} from '@/lib/adminPwaConfig';

/** Manifiesto PWA solo para el panel admin (icono candado en escritorio). */
export function adminPreciosManifest(): MetadataRoute.Manifest {
  return {
    id: '/admin-precios',
    name: `${ADMIN_PWA_TITLE} — Grupo Proenergéticos`,
    short_name: ADMIN_PWA_TITLE,
    description: 'Panel de control para captura manual de precios de combustible.',
    start_url: ADMIN_PWA_START_URL,
    scope: '/admin-precios',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: ADMIN_PWA_THEME,
    lang: 'es-MX',
    categories: ['business', 'utilities'],
    icons: [
      {
        src: ADMIN_PWA_ICON,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: ADMIN_PWA_ICON,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
