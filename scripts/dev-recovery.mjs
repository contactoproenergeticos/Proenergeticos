import { spawn } from 'node:child_process';

const env = { ...process.env, NEXT_DIST_DIR: '.next-fresh' };

console.log('Iniciando next dev con NEXT_DIST_DIR=.next-fresh (evita .next bloqueado)…\n');

const child = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env,
  cwd: process.cwd(),
});

child.on('exit', (code) => process.exit(code ?? 0));
