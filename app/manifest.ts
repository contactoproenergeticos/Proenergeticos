import type { MetadataRoute } from 'next';

/**
 * Manifiesto PWA (instalable / “Añadir a pantalla de inicio”).
 * Icono: /public/images/logotipos/ProEner.png
 */
export default function manifest(): MetadataRoute.Manifest {
  const icon = '/images/logotipos/ProEner.png';
  const adminIcon = '/icon-admin.svg';

  return {
    name: 'Grupo Proenergéticos — Estaciones de servicio',
    short_name: 'Grupo Proenergéticos',
    description:
      'Combustibles de alta calidad y servicio en Mazatlán, Sinaloa. Consulta precios, estaciones y facturación.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#ffffff',
    theme_color: '#E30613',
    lang: 'es-MX',
    categories: ['business', 'utilities'],
    icons: [
      {
        src: icon,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: icon,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Administrar Precios',
        short_name: 'Admin Precios',
        description: 'Panel de control secreto para la captura manual de precios',
        url: '/admin-precios',
        icons: [
          {
            src: adminIcon,
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
    ],
  };
}
