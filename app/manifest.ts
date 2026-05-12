import type { MetadataRoute } from 'next';

/**
 * Manifiesto PWA (instalable / “Añadir a pantalla de inicio”).
 * Icono: /public/images/logotipos/ProEner.png
 */
export default function manifest(): MetadataRoute.Manifest {
  const icon = '/images/logotipos/ProEner.png';

  return {
    name: 'Proenergéticos — Estaciones de servicio',
    short_name: 'Proenergéticos',
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
  };
}
