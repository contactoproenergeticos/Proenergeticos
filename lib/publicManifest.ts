import type { MetadataRoute } from 'next';

/** Manifiesto PWA de la web pública (no incluye /admin-precios). */
export function publicSiteManifest(): MetadataRoute.Manifest {
  const icon = '/images/logotipos/ProEner.png';

  return {
    id: '/',
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
  };
}

export function publicSiteManifestResponse(): Response {
  return Response.json(publicSiteManifest(), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
