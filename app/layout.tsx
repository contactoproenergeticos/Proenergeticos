import { GoogleTagManager } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic'; // Paso 1: Importar dynamic

// Paso 2: Importar el botón desactivando el renderizado de servidor (SSR)
const AccessibilityButton = dynamic(() => import('../components/AccessibilityButton'), { 
  ssr: false 
});

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
        {/* Ahora Next.js ignorará este botón durante el build de la página 404 */}
        <AccessibilityButton />
      </body>
    </html>
  );
}