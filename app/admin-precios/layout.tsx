import type { Metadata, Viewport } from 'next';
import AdminPwaIcons from '@/components/admin-precios/AdminPwaIcons';

const adminIcon = '/icon-admin.svg';

export const metadata: Metadata = {
  title: 'Admin Precios — Grupo Proenergéticos',
  description: 'Panel de control para captura manual de precios de combustible.',
  applicationName: 'Admin Precios',
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Admin Precios',
  },
  icons: {
    icon: [
      { url: adminIcon, type: 'image/svg+xml', sizes: 'any' },
      { url: adminIcon, type: 'image/svg+xml', sizes: '192x192' },
      { url: adminIcon, type: 'image/svg+xml', sizes: '512x512' },
    ],
    apple: [
      { url: adminIcon, sizes: '180x180', type: 'image/svg+xml' },
      { url: adminIcon, sizes: '192x192', type: 'image/svg+xml' },
    ],
    shortcut: adminIcon,
  },
};

export const viewport: Viewport = {
  themeColor: '#E30613',
};

export default function AdminPreciosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminPwaIcons />
      {children}
    </>
  );
}
