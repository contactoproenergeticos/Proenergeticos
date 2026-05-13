/**
 * Entrada para CI: misma sincronización que `npm run sync:precios` sin `--env-file`.
 * Variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Leyendas (America/Mazatlan): `PREC_SYNC_FECHA_ACTUALIZACION` y `PREC_SYNC_HORA_ACTUALIZACION`.
 * - Local / npm: se calculan aquí y se pasan al proceso hijo.
 * - GitHub Actions: el workflow puede exportarlas antes con `--write-github-env` y
 *   reinyectarlas en el paso de sincronización vía env: ${{ env.PREC_SYNC_* }}.
 */
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
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

/** Formato heredoc de GitHub Actions para valores con comas u otros caracteres. */
function appendGithubEnvVar(envFilePath, name, value) {
  const delim = '___PREC_SYNC_LEYENDA___';
  appendFileSync(envFilePath, `${name}<<${delim}\n${String(value).replace(/\r/g, '')}\n${delim}\n`, 'utf8');
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const tsxCli = path.join(root, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const cliTs = path.join(root, 'scripts', 'sync-precios-cli.ts');

const argv = process.argv.slice(2);

if (argv.includes('--write-github-env')) {
  const gh = process.env.GITHUB_ENV;
  if (!gh) {
    console.warn('[sync-precios-combustible] GITHUB_ENV no está definido; no se escriben PREC_SYNC_*.');
    process.exit(0);
  }
  const instant = new Date();
  appendGithubEnvVar(gh, 'PREC_SYNC_FECHA_ACTUALIZACION', buildFechaActualizacion(instant));
  appendGithubEnvVar(gh, 'PREC_SYNC_HORA_ACTUALIZACION', buildHoraActualizacion(instant));
  process.exit(0);
}

const instant = new Date();
const fecha =
  process.env.PREC_SYNC_FECHA_ACTUALIZACION?.trim() || buildFechaActualizacion(instant);
const hora =
  process.env.PREC_SYNC_HORA_ACTUALIZACION?.trim() || buildHoraActualizacion(instant);

const env = {
  ...process.env,
  PREC_SYNC_FECHA_ACTUALIZACION: fecha,
  PREC_SYNC_HORA_ACTUALIZACION: hora,
};

execFileSync(process.execPath, [tsxCli, cliTs], {
  stdio: 'inherit',
  cwd: root,
  env,
});
