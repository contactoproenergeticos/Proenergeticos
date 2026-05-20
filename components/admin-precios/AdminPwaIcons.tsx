'use client';

import { useEffect } from 'react';

const ADMIN_ICON = '/icon-admin.svg';
const ADMIN_THEME = '#E30613';

/**
 * Refuerza iconos distintos al anclar /admin-precios en iOS y navegadores que lean
 * link[rel=apple-touch-icon] del DOM (el manifest shortcut cubre Android/Chrome).
 */
export default function AdminPwaIcons() {
  useEffect(() => {
    const previousTitle = document.title;

    const metaTheme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const prevTheme = metaTheme?.getAttribute('content');
    if (metaTheme) metaTheme.setAttribute('content', ADMIN_THEME);

    const links: HTMLLinkElement[] = [];
    const specs: { rel: string; type?: string; sizes?: string }[] = [
      { rel: 'icon', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', sizes: '180x180' },
      { rel: 'apple-touch-icon', sizes: '192x192' },
      { rel: 'apple-touch-icon', sizes: '512x512' },
      { rel: 'shortcut icon', type: 'image/svg+xml' },
    ];

    for (const spec of specs) {
      const link = document.createElement('link');
      link.rel = spec.rel;
      link.href = ADMIN_ICON;
      if (spec.type) link.type = spec.type;
      if (spec.sizes) link.sizes = spec.sizes;
      link.setAttribute('data-admin-pwa-icon', '1');
      document.head.appendChild(link);
      links.push(link);
    }

    let appName = document.querySelector<HTMLMetaElement>('meta[name="application-name"]');
    const createdAppName = !appName;
    if (!appName) {
      appName = document.createElement('meta');
      appName.setAttribute('name', 'application-name');
      document.head.appendChild(appName);
    }
    const prevAppName = appName.getAttribute('content');
    appName.setAttribute('content', 'Admin Precios');

    let appleTitle = document.querySelector<HTMLMetaElement>('meta[name="apple-mobile-web-app-title"]');
    const createdAppleTitle = !appleTitle;
    if (!appleTitle) {
      appleTitle = document.createElement('meta');
      appleTitle.setAttribute('name', 'apple-mobile-web-app-title');
      document.head.appendChild(appleTitle);
    }
    const prevAppleTitle = appleTitle.getAttribute('content');
    appleTitle.setAttribute('content', 'Admin Precios');

    return () => {
      links.forEach((l) => l.remove());
      if (metaTheme && prevTheme != null) metaTheme.setAttribute('content', prevTheme);
      if (appName) {
        if (createdAppName) appName.remove();
        else if (prevAppName != null) appName.setAttribute('content', prevAppName);
      }
      if (appleTitle) {
        if (createdAppleTitle) appleTitle.remove();
        else if (prevAppleTitle != null) appleTitle.setAttribute('content', prevAppleTitle);
      }
      document.title = previousTitle;
    };
  }, []);

  return null;
}
