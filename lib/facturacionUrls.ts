/**
 * URLs de portales de facturación (tabla `facturacion` en Supabase).
 * Compartido entre la ruta API (servidor) y cualquier otro consumidor.
 */

export type FacturacionLinks = {
  GSI: string | null;
  GPO: string | null;
};

/**
 * Si el valor no incluye protocolo, se antepone `https://`
 * para no tratarlo como ruta relativa del sitio.
 */
export function normalizarUrlFacturacion(valor: unknown): string | null {
  if (typeof valor !== 'string') return null;
  const limpio = valor.trim();
  if (!limpio) return null;
  if (/^https?:\/\//i.test(limpio)) return limpio;
  return `https://${limpio}`;
}

function valorPorClaveInsensitive(
  fila: Record<string, unknown>,
  clave: keyof FacturacionLinks
): string | null {
  const objetivo = clave.toLowerCase();
  for (const [k, v] of Object.entries(fila)) {
    if (k.toLowerCase() === objetivo) return normalizarUrlFacturacion(v);
  }
  return null;
}

export function enlacesDesdeFilaFacturacion(fila: Record<string, unknown>): FacturacionLinks {
  // En Supabase las URLs quedaron en la columna opuesta; se invierten al exponerlas.
  return {
    GSI: valorPorClaveInsensitive(fila, 'GPO'),
    GPO: valorPorClaveInsensitive(fila, 'GSI'),
  };
}
