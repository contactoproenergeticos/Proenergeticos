/**
 * Punto de extensión para futuras notificaciones Web Push (VAPID + Service Worker).
 * No implementa registro aún: evita duplicar o competir con el manifiesto PWA existente.
 */
export type PushReadiness = 'unsupported' | 'needs-sw' | 'ready';

export function getPushReadiness(): PushReadiness {
  if (typeof window === 'undefined') return 'unsupported';
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return 'unsupported';
  return 'needs-sw';
}

export async function registerPushWhenReady(): Promise<PushSubscription | null> {
  return null;
}
