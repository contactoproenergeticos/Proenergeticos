'use client';

/**
 * Banner premium de instalación PWA (QR → móvil).
 * - Android (Chrome): beforeinstallprompt + prompt() nativo.
 * - iOS (Safari/WebKit): instrucciones “Compartir → Añadir a pantalla de inicio”.
 * No modifica manifest ni metadata; solo UX de instalación.
 */

import { getPushReadiness } from '@/lib/pwaPushPlaceholder';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Download, Share2, Smartphone, X } from 'lucide-react';

// --- Constantes de almacenamiento (cooldown + versión para campañas futuras) ---
export const PWA_STORAGE_DISMISS_AT = 'pwa-install-dismiss-at';
export const PWA_STORAGE_INSTALLED = 'pwa-was-installed-flag';
export const PWA_STORAGE_PROMPT_VERSION = 'pwa-install-prompt-version';

const PROMPT_VERSION = '1';
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 días si el usuario cerró
const SHOW_DELAY_MS = 3200;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    nav.standalone === true
  );
}

function isMobilePhoneLike(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  return ios || android;
}

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

function isAndroid(): boolean {
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
}

function shouldSuppressByStorage(): boolean {
  try {
    if (typeof localStorage === 'undefined') return false;
    if (localStorage.getItem(PWA_STORAGE_INSTALLED) === '1') return true;
    const v = localStorage.getItem(PWA_STORAGE_PROMPT_VERSION);
    if (v !== PROMPT_VERSION) return false;
    const raw = localStorage.getItem(PWA_STORAGE_DISMISS_AT);
    if (!raw) return false;
    const t = Number(raw);
    if (!Number.isFinite(t)) return false;
    return Date.now() - t < COOLDOWN_MS;
  } catch {
    return false;
  }
}

function persistDismiss(): void {
  try {
    localStorage.setItem(PWA_STORAGE_DISMISS_AT, String(Date.now()));
    localStorage.setItem(PWA_STORAGE_PROMPT_VERSION, PROMPT_VERSION);
  } catch {
    /* private mode / bloqueo */
  }
}

function persistInstalled(): void {
  try {
    localStorage.setItem(PWA_STORAGE_INSTALLED, '1');
  } catch {
    /* noop */
  }
}

export default function InstallPWA() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const platform = useMemo(() => {
    if (!mounted) return 'unknown';
    if (isIOS()) return 'ios';
    if (isAndroid()) return 'android';
    return 'other';
  }, [mounted]);

  const eligible = useMemo(() => {
    if (!mounted) return false;
    if (pathname?.startsWith('/admin-precios')) return false;
    if (!isMobilePhoneLike()) return false;
    if (isStandalone()) return false;
    if (shouldSuppressByStorage()) return false;
    return true;
  }, [mounted, pathname]);

  // Refleja el último prompt en ref para handlers estables sin re-suscribir en cada render.
  useEffect(() => {
    deferredRef.current = deferredPrompt;
  }, [deferredPrompt]);

  useEffect(() => {
    setMounted(true);
    // Reserva de API para futuras notificaciones push (sin efecto aún).
    getPushReadiness();
  }, []);

  useEffect(() => {
    if (!mounted || !eligible) return;

    const onBip = (e: Event) => {
      e.preventDefault();
      const ev = e as BeforeInstallPromptEvent;
      deferredRef.current = ev;
      setDeferredPrompt(ev);
    };

    const onInstalled = () => {
      persistInstalled();
      setDeferredPrompt(null);
      setOpen(false);
    };

    window.addEventListener('beforeinstallprompt', onBip);
    window.addEventListener('appinstalled', onInstalled);

    showTimerRef.current = setTimeout(() => {
      setOpen(true);
    }, SHOW_DELAY_MS);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBip);
      window.removeEventListener('appinstalled', onInstalled);
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
    };
  }, [mounted, eligible]);

  const handleClose = useCallback(() => {
    persistDismiss();
    setOpen(false);
  }, []);

  const handleInstallAndroid = useCallback(async () => {
    const ev = deferredRef.current;
    if (!ev?.prompt) {
      return;
    }
    try {
      await ev.prompt();
      await ev.userChoice;
    } catch {
      /* usuario canceló o navegador rechazó */
    } finally {
      setDeferredPrompt(null);
      deferredRef.current = null;
      setOpen(false);
    }
  }, []);

  if (!mounted || !eligible) return null;

  const showAndroidInstall = platform === 'android';
  const showIOSInstructions = platform === 'ios';
  const androidButtonDisabled = showAndroidInstall && !deferredPrompt;

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-[500] flex justify-center p-4 transition-all duration-500 ease-out md:hidden ${
        open ? 'pointer-events-auto opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      aria-hidden={!open}
    >
      {/* Capa semitransparente opcional: no cubrir toda la pantalla para no ser invasivo */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-install-title"
        className={`relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/30 bg-white/85 shadow-[0_25px_80px_-12px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-500 ease-out ${
          open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-slate-50/80" />
        <div className="relative px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
                <Image
                  src="/images/logotipos/ProEner.png"
                  alt=""
                  fill
                  className="object-contain p-1.5"
                  sizes="56px"
                  priority={false}
                />
              </div>
              <div className="min-w-0">
                <p
                  id="pwa-install-title"
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Instalación rápida
                </p>
                <h2 className="text-lg font-black italic tracking-tight text-slate-900 sm:text-xl">
                  Grupo Pro-energéticos <span className="text-[#E30613]">App</span>
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full p-2 text-slate-400 transition hover:bg-black/5 hover:text-slate-700"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="mb-4 text-sm font-medium leading-relaxed text-slate-600">
            {showAndroidInstall && (
              <>
                Instala la app en tu inicio para abrirla al instante tras escanear el código QR, incluso sin
                buscar el enlace otra vez.
              </>
            )}
            {showIOSInstructions && (
              <>
                En iPhone o iPad, añade la web a tu pantalla de inicio para una experiencia tipo app nativa.
              </>
            )}
          </p>

          {showAndroidInstall && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleInstallAndroid}
                disabled={androidButtonDisabled}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E30613] px-4 py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-red-500/30 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-5 w-5 shrink-0" />
                Instalar app
              </button>
              {androidButtonDisabled && (
                <p className="text-center text-xs font-semibold text-slate-500">
                  Esperando permiso del navegador… Si no aparece, usa el menú ⋮ de Chrome y “Instalar app” o
                  “Añadir a la pantalla principal”.
                </p>
              )}
            </div>
          )}

          {showIOSInstructions && (
            <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white/60 p-4 shadow-inner">
              <div className="flex items-center gap-2 text-sm font-black text-slate-800">
                <Share2 className="h-5 w-5 text-[#E30613]" />
                Pasos en Safari
              </div>
              <ol className="space-y-3 text-sm font-semibold text-slate-700">
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E30613] text-xs font-black text-white">
                    1
                  </span>
                  <span>
                    Toca el botón <strong className="text-slate-900">Compartir</strong>{' '}
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-300 bg-white align-middle text-slate-500">
                      <Share2 className="h-3.5 w-3.5" />
                    </span>{' '}
                    en la barra inferior.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
                    2
                  </span>
                  <span>
                    Desplázate y elige <strong className="text-slate-900">«Agregar a la pantalla de inicio»</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-black text-slate-800">
                    3
                  </span>
                  <span>
                    Confirma con <strong className="text-slate-900">Agregar</strong>. El icono aparecerá junto a tus
                    apps.
                  </span>
                </li>
              </ol>
              <div className="flex items-center gap-2 rounded-xl bg-slate-900/5 px-3 py-2 text-xs font-medium text-slate-600">
                <Smartphone className="h-4 w-4 shrink-0 text-[#E30613]" />
                Si abriste el QR dentro de Instagram o Facebook, abre el enlace en Safari para ver la opción.
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleClose}
            className="mt-4 w-full rounded-2xl border border-slate-200/90 bg-white/80 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            Ahora no
          </button>
        </div>
      </div>
    </div>
  );
}
