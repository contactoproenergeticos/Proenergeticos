import { GoogleTagManager } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AccessibilityButton from '../components/AccessibilityButton'; // Importación directa
import InstallPWA from '../components/InstallPWA';

const inter = Inter({ subsets: ['latin'] });

const pwaIcon = '/images/logotipos/ProEner.png';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export const metadata: Metadata = {
  title: 'Proenergéticos - Estaciones de Servicio',
  description: 'Sistema de gestión y monitoreo para estaciones de servicio Proenergéticos.',
  applicationName: 'Proenergéticos',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Proenergéticos',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: pwaIcon, type: 'image/png', sizes: '32x32' },
      { url: pwaIcon, type: 'image/png', sizes: '48x48' },
      { url: pwaIcon, type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: pwaIcon, sizes: '180x180', type: 'image/png' }],
    shortcut: pwaIcon,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <GoogleTagManager gtmId="GTM-P53V68D7" />
      <body className={inter.className}>
        {children}
        <InstallPWA />
        <AccessibilityButton />
      </body>
    </html>
  );
}