import { existsSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const cwd = process.cwd();
const dir = join(cwd, '.next');
const stamp = Date.now().toString(36);

function removeDir(target) {
  if (!existsSync(target)) return true;
  try {
    rmSync(target, { recursive: true, force: true, maxRetries: 5, retryDelay: 400 });
    return true;
  } catch {
    return false;
  }
}

if (!existsSync(dir)) {
  console.log('.next no existe; nada que limpiar.');
  process.exit(0);
}

// En Windows a veces `trace` queda bloqueado: renombrar primero suele liberar el resto.
const backup = join(cwd, `.next_backup_${stamp}`);
try {
  renameSync(dir, backup);
  console.log(`Carpeta .next renombrada a ${backup.split(/[/\\]/).pop()}`);
} catch {
  console.warn('No se pudo renombrar .next; intentando borrado directo…');
}

if (existsSync(dir) && !removeDir(dir)) {
  console.error(
    [
      'No se pudo limpiar .next (archivo bloqueado, p. ej. .next/trace).',
      '',
      '1. Cierra todas las terminales con `npm run dev` (Ctrl+C).',
      '2. Cierra pestañas de localhost:3000.',
      '3. Vuelve a ejecutar: npm run clean',
      '',
      'Si sigue fallando, arranca con carpeta nueva:',
      '   PowerShell:  $env:NEXT_DIST_DIR=".next-fresh"; npm run dev',
      '   CMD:         set NEXT_DIST_DIR=.next-fresh && npm run dev',
    ].join('\n')
  );
  process.exit(1);
}

if (existsSync(backup)) {
  removeDir(backup);
  if (existsSync(backup)) {
    console.log(`Respaldo ${backup.split(/[/\\]/).pop()} quedó en disco; bórralo manualmente cuando puedas.`);
  }
}

console.log('Listo. Ejecuta: npm run dev');
