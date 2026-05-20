import { rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(process.cwd(), '.next');

if (!existsSync(dir)) {
  console.log('.next no existe; nada que limpiar.');
  process.exit(0);
}

try {
  rmSync(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 500 });
  console.log('Carpeta .next eliminada correctamente.');
} catch (err) {
  console.error(
    'No se pudo borrar .next. Detén el servidor (Ctrl+C en la terminal de npm run dev) e intenta de nuevo.\n',
    err.message
  );
  process.exit(1);
}
