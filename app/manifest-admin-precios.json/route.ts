import { adminPreciosManifestResponse } from '@/lib/adminManifest';

export const dynamic = 'force-static';

export function GET() {
  return adminPreciosManifestResponse();
}
