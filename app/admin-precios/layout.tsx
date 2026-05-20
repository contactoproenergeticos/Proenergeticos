import type { Metadata, Viewport } from 'next';
import AdminPwaIcons from '@/components/admin-precios/AdminPwaIcons';
import { ADMIN_PWA_ICON, ADMIN_PWA_TITLE, ADMIN_PWA_THEME } from '@/lib/adminPwaConfig';

export const metadata: Metadata = {
  title: 'Admin Precios — Grupo Proenergéticos',
  description: 'Panel de control para captura manual de precios de combustible.',
  applicationName: ADMIN_PWA_TITLE,
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: ADMIN_PWA_TITLE,
  },
  icons: {
    icon: [
      { url: ADMIN_PWA_ICON, type: 'image/png', sizes: '192x192' },
      { url: ADMIN_PWA_ICON, type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: ADMIN_PWA_ICON, sizes: '180x180', type: 'image/png' },
      { url: ADMIN_PWA_ICON, sizes: '192x192', type: 'image/png' },
    ],
    shortcut: ADMIN_PWA_ICON,
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-title': ADMIN_PWA_TITLE,
  },
};

export const viewport: Viewport = {
  themeColor: ADMIN_PWA_THEME,
};

export default function AdminPreciosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminPwaIcons />
      {children}
    </>
  );
}
