import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { LogoutButton } from '@/components/auth/logout-button';
export const dynamic = 'force-dynamic';
export default async function CandidateLayout({children}:{children:React.ReactNode}){
  await requireRole('CUSTOMER',{next:'/kandidat/profil'});
  return <div className="min-h-screen bg-background">
    <header className="border-b"><nav className="mx-auto flex max-w-5xl items-center gap-5 px-4 py-4 text-sm">
      <Link href="/" className="font-bold">SERVIShub.</Link>
      <Link href="/praca">Ponuky</Link><Link href="/kandidat/profil">Môj profil</Link><Link href="/kandidat/ziadosti">Moje žiadosti</Link><Link href="/kandidat/strazeny-pes">Strážny pes</Link>
    <span className="ml-auto"><LogoutButton/></span></nav></header><main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
  </div>;
}
