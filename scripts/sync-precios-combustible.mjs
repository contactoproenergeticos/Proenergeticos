/**
 * Entrada para CI: misma sincronización que `npm run sync:precios` sin `--env-file`.
 * Variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Aquí se calculan las leyendas de vigencia (huso America/Mazatlan) y se inyectan al
 * proceso hijo vía entorno; ver `PREC_SYNC_FECHA_ACTUALIZACION` y `PREC_SYNC_HORA_ACTUALIZACION`.
 */
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const TZ = 'America/Mazatlan';

/**
 * Ej.: 'miércoles, 13 de mayo' (sin año; minúsculas como en es-MX).
 */
function buildFechaActualizacion(instant) {
  const weekday = new Intl.DateTimeFormat('es-MX', { timeZone: TZ, weekday: 'long' }).format(instant);
  const day = new Intl.DateTimeFormat('es-MX', { timeZone: TZ, day: 'numeric' }).format(instant);
  const month = new Intl.DateTimeFormat('es-MX', { timeZone: TZ, month: 'long' }).format(instant);
  return `${weekday.toLowerCase()}, ${day} de ${month}`;
}

/**
 * Ej.: '01:15 PM'
 */
function buildHoraActualizacion(instant) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(instant);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const tsxCli = path.join(root, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const cliTs = path.join(root, 'scripts', 'sync-precios-cli.ts');

const instant = new Date();
const env = {
  ...process.env,
  PREC_SYNC_FECHA_ACTUALIZACION: buildFechaActualizacion(instant),
  PREC_SYNC_HORA_ACTUALIZACION: buildHoraActualizacion(instant),
};

execFileSync(process.execPath, [tsxCli, cliTs], {
  stdio: 'inherit',
  cwd: root,
  env,
});
