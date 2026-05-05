import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Proenergéticos | Líderes en Mazatlán',
  description: 'Proenergéticos S.A. de C.V. - Cumplimiento NOM-016-CRE-2016',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-gray-200 overflow-x-hidden w-full relative">
        <main className="overflow-x-hidden w-full relative">
          {children}
        </main>
      </body>
    </html>
  );
}
