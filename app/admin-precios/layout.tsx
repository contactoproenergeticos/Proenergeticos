import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Precios',
  robots: { index: false, follow: false },
};

export default function AdminPreciosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
