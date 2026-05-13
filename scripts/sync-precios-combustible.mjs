/**
 * Entrada para CI: misma sincronización que `npm run sync:precios` sin `--env-file`.
 * Variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const tsxCli = path.join(root, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const cliTs = path.join(root, 'scripts', 'sync-precios-cli.ts');

execFileSync(process.execPath, [tsxCli, cliTs], {
  stdio: 'inherit',
  cwd: root,
  env: process.env,
});
