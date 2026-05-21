import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

/** Redirige la ruta legacy al manifiesto con extensión .json */
export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/manifest-admin-precios.json', request.url), 308);
}
