import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Evita que Vercel inyecte la barra flotante (círculo negro con logo) en despliegues.
 * La plataforma omite el toolbar si la petición lleva `x-vercel-skip-toolbar`.
 * @see https://vercel.com/docs/workflow-collaboration/vercel-toolbar/managing-toolbar
 */
export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-vercel-skip-toolbar', '1');

  return NextResponse.next({
    request: { headers },
  });
}

export const config = {
  matcher: [
    /*
     * Excluye estáticos para no ejecutar middleware en cada asset.
     */
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|manifest.webmanifest|manifest-admin-precios|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
};
