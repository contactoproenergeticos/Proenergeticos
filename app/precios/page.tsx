import PreciosPageClient from './PreciosPageClient';

/** Sin caché estática de la ruta: el shell se genera en cada solicitud (los datos van por cliente → Supabase). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return <PreciosPageClient />;
}
