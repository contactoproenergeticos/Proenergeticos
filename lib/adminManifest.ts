import type { MetadataRoute } from 'next';
import {
  ADMIN_PWA_ICON,
  ADMIN_PWA_SCOPE,
  ADMIN_PWA_START_URL,
  ADMIN_PWA_THEME,
  ADMIN_PWA_TITLE,
} from '@/lib/adminPwaConfig';

/** Manifiesto PWA solo para el panel admin (icono candado en escritorio). */
export function adminPreciosManifest(): MetadataRoute.Manifest {
  return {
    id: `${ADMIN_PWA_SCOPE}?source=pwa-admin`,
    name: `${ADMIN_PWA_TITLE} — Grupo Pro-energéticos`,
    short_name: ADMIN_PWA_TITLE,
    description: 'Panel de control para captura manual de precios de combustible.',
    start_url: ADMIN_PWA_START_URL,
    scope: `${ADMIN_PWA_SCOPE}/`,
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

export function adminPreciosManifestResponse(): Response {
  return Response.json(adminPreciosManifest(), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
