import { GoogleTagManager } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import AccessibilityButton from '../components/AccessibilityButton';
import PublicPwaScope from '../components/PublicPwaScope';
import SplashGate from '../components/SplashGate';
import { PWA_LAUNCH_GUARD_SCRIPT } from '@/lib/pwaLaunchGuard';

const inter = Inter({ subsets: ['latin'] });

const pwaIcon = '/images/logotipos/ProEner.png';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0c' },
  ],
};

const sharedMetadata: Metadata = {
  title: 'Grupo Pro-energéticos - Estaciones de Servicio',
  description: 'Sistema de gestión y monitoreo para estaciones de servicio Grupo Pro-energéticos.',
  formatDetection: {
    telephone: false,
  },
};

const publicPwaMetadata: Metadata = {
  manifest: '/manifest.webmanifest',
  applicationName: 'Grupo Pro-energéticos',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Grupo Pro-energéticos',
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

export async function generateMetadata(): Promise<Metadata> {
  const pathname = (await headers()).get('x-pathname') ?? '';

  if (pathname.startsWith('/admin-precios')) {
    return sharedMetadata;
  }

  return {
    ...sharedMetadata,
    ...publicPwaMetadata,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <GoogleTagManager gtmId="GTM-P53V68D7" />
      <body className={inter.className}>
        <Script id="pwa-launch-guard" strategy="beforeInteractive">
          {PWA_LAUNCH_GUARD_SCRIPT}
        </Script>
        <SplashGate>{children}</SplashGate>
        <PublicPwaScope />
        <AccessibilityButton />
      </body>
    </html>
  );
}
