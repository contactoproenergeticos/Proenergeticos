import { adminPreciosManifest } from '@/lib/adminManifest';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(adminPreciosManifest(), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
