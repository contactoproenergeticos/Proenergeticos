/**
 * Regenera public/icon-admin.png desde public/icon-admin.svg (requiere red online).
 * Uso: node scripts/generate-icon-admin-png.mjs
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const svg = join(root, 'public', 'icon-admin.svg');
const png = join(root, 'public', 'icon-admin.png');

if (!existsSync(svg)) {
  console.error('No existe public/icon-admin.svg');
  process.exit(1);
}

const r = spawnSync(
  'npx',
  ['--yes', '@resvg/resvg-js-cli', svg, png, '--fit-width', '512', '--fit-height', '512'],
  { stdio: 'inherit', shell: true, cwd: root }
);

process.exit(r.status ?? 1);
