/**
 * CLI: misma sincronización que /api/cron/sync-precios (ver lib/syncPreciosCombustible.ts).
 * Uso: npm run sync:precios
 */

import { runSyncPreciosCombustible } from '../lib/syncPreciosCombustible';

async function main() {
  const result = await runSyncPreciosCombustible();
  if (result.warnings?.length) {
    for (const w of result.warnings) console.warn(w);
  }
  if (result.updates?.length) {
    for (const u of result.updates) {
      console.log(`[${u.estacion}] ${u.label}: ${u.from} → ${u.to}`);
    }
  }
  if (!result.ok) {
    console.error(result.error ?? 'sync falló');
    process.exit(1);
  }
  console.log('Sincronización terminada.', result.durationMs != null ? `(${result.durationMs} ms)` : '');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
