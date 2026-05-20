export const PRECIO_MIN = 10;
export const PRECIO_MAX = 50;

export function validatePrecioInput(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === '') return 'Campo vacío';
  const n = Number(trimmed.replace(',', '.'));
  if (!Number.isFinite(n)) return 'Número inválido';
  if (n < 0) return 'No puede ser negativo';
  if (n < PRECIO_MIN || n > PRECIO_MAX) {
    return `Debe estar entre $${PRECIO_MIN} y $${PRECIO_MAX}`;
  }
  return null;
}

export function parsePrecioInput(value: string): number | null {
  const err = validatePrecioInput(value);
  if (err) return null;
  return Number(value.trim().replace(',', '.'));
}
