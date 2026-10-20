import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { LogoutButton } from '@/components/auth/logout-button';
export const dynamic = 'force-dynamic';

export default async function EmployerLayout({ children }: { children: React.ReactNode }) {
  await requireRole(['PROVIDER', 'ADMIN'], { next: '/firma/dashboard' });
  return <div className="min-h-screen bg-background">
    <header className="border-b px-4 py-4"><nav aria-label="Firma" className="mx-auto flex max-w-6xl items-center gap-6">
      <Link href="/" className="text-lg font-bold">Talent Marketplace</Link>
      <Link href="/firma/dashboard" className="text-sm">Dashboard</Link>
      <Link href="/firma/profil" className="text-sm">Nastavenia</Link>
      <Link href="/praca" className="ml-auto text-sm">Pracovné ponuky</Link><LogoutButton/>
    </nav></header>
    <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
  </div>;
}
