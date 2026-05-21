'use client';

import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Splash = dynamic(() => import('./Splash'), { ssr: false });

const SESSION_KEY = 'proener-splash-seen-v1';

function shouldShowSplash(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  const params = new URLSearchParams(window.location.search);
  if (params.get('splash') === '1') return true;

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    // iOS Safari PWA
    (typeof navigator !== 'undefined' &&
      'standalone' in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true);

  if (!isStandalone) return false;
  if (window.location.pathname.startsWith('/admin-precios')) return false;
  if (sessionStorage.getItem(SESSION_KEY) === '1') return false;

  return true;
}

export default function SplashGate({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (shouldShowSplash()) setShowSplash(true);
  }, []);

  const handleComplete = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
    setShowSplash(false);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {showSplash && <Splash onComplete={handleComplete} />}
      <div
        className={`transition-opacity duration-500 ease-out ${showSplash ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      >
        {children}
      </div>
    </>
  );
}
