import { GoogleTagManager } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AccessibilityButton from '../components/AccessibilityButton'; // Importación directa

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Proenergéticos - Estaciones de Servicio',
  description: 'Sistema de gestión y monitoreo para estaciones de servicio Proenergéticos.',
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
        <AccessibilityButton />
      </body>
    </html>
  );
}