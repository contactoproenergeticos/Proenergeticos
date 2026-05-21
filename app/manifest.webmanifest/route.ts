import { publicSiteManifestResponse } from '@/lib/publicManifest';

export const dynamic = 'force-static';

export function GET() {
  return publicSiteManifestResponse();
}
