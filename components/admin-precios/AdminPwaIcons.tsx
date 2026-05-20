'use client';

import { useEffect } from 'react';
import { ADMIN_PWA_ICON, ADMIN_PWA_TITLE, ADMIN_PWA_THEME } from '@/lib/adminPwaConfig';

const DATA_ATTR = 'data-admin-pwa-head';

/**
 * Inyecta en <head> iconos PNG y meta de Apple solo en /admin-precios.
 * iOS no admite SVG en apple-touch-icon; PNG evita el icono vacío.
 */
export default function AdminPwaIcons() {
  useEffect(() => {
    const created: HTMLElement[] = [];

    const add = (el: HTMLElement) => {
      el.setAttribute(DATA_ATTR, '1');
      document.head.appendChild(el);
      created.push(el);
    };

    const linkDefault = document.createElement('link');
    linkDefault.rel = 'apple-touch-icon';
    linkDefault.href = ADMIN_PWA_ICON;
    add(linkDefault);

    const link180 = document.createElement('link');
    link180.rel = 'apple-touch-icon';
    link180.href = ADMIN_PWA_ICON;
    link180.sizes = '180x180';
    add(link180);

    const link192 = document.createElement('link');
    link192.rel = 'apple-touch-icon';
    link192.href = ADMIN_PWA_ICON;
    link192.sizes = '192x192';
    add(link192);

    const iconPng = document.createElement('link');
    iconPng.rel = 'icon';
    iconPng.type = 'image/png';
    iconPng.href = ADMIN_PWA_ICON;
    add(iconPng);

    const shortcut = document.createElement('link');
    shortcut.rel = 'shortcut icon';
    shortcut.type = 'image/png';
    shortcut.href = ADMIN_PWA_ICON;
    add(shortcut);

    const metaCapable = document.createElement('meta');
    metaCapable.name = 'apple-mobile-web-app-capable';
    metaCapable.content = 'yes';
    add(metaCapable);

    const metaTitle = document.createElement('meta');
    metaTitle.name = 'apple-mobile-web-app-title';
    metaTitle.content = ADMIN_PWA_TITLE;
    add(metaTitle);

    const metaTheme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const prevTheme = metaTheme?.getAttribute('content');
    if (metaTheme) metaTheme.setAttribute('content', ADMIN_PWA_THEME);

    let appName = document.querySelector<HTMLMetaElement>('meta[name="application-name"]');
    const createdAppName = !appName;
    if (!appName) {
      appName = document.createElement('meta');
      appName.name = 'application-name';
      add(appName);
    }
    const prevAppName = appName.getAttribute('content');
    appName.content = ADMIN_PWA_TITLE;

    return () => {
      created.forEach((el) => el.remove());
      if (metaTheme && prevTheme != null) metaTheme.setAttribute('content', prevTheme);
      if (appName) {
        if (createdAppName) {
          /* ya removido con created */
        } else if (prevAppName != null) {
          appName.setAttribute('content', prevAppName);
        }
      }
    };
  }, []);

  return null;
}
