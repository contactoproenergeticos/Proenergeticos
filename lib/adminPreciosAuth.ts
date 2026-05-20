export function getAdminPreciosPin(): string {
  const fromEnv = process.env.ADMIN_PRECIOS_PIN?.trim();
  return fromEnv && fromEnv.length >= 4 ? fromEnv : '4321';
}

export function verifyAdminPreciosPin(pin: unknown): boolean {
  const normalized = String(pin ?? '').trim();
  if (!normalized) return false;
  return normalized === getAdminPreciosPin();
}

export function unauthorizedPreciosResponse() {
  return Response.json({ ok: false, error: 'PIN incorrecto o no autorizado.' }, { status: 401 });
}
