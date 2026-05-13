/**
 * Clasificación de filas `precios_combustible` → tipo de combustible scrapeado.
 * Usado en sync (servidor) y en Precios (cliente); solo utilidades puras.
 */

export type FuelKind = 'magna' | 'premium' | 'diesel';

export function normalizeFuelText(s: string | null | undefined): string {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

/**
 * Infiere magna / premium / diesel a partir de `label` y opcionalmente `subtitulo`
 * (p. ej. label "Industrial" + subtitulo "Diésel" → diesel).
 */
export function fuelKindFromParts(
  label: string | null | undefined,
  subtitulo?: string | null | undefined
): FuelKind | null {
  const blob = normalizeFuelText(`${label ?? ''} ${subtitulo ?? ''}`);

  if (blob.includes('diesel') || blob.includes('gasoleo')) {
    return 'diesel';
  }
  if (blob.includes('premium')) return 'premium';
  if (blob.includes('magna')) return 'magna';

  // Diésel a veces solo en marketing: industrial UBA en estaciones Proener sin la palabra en label
  if (blob.includes('industrial') && !blob.includes('gasolina') && !blob.includes('magna')) {
    return 'diesel';
  }

  return null;
}
