import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { CompanyForm } from './company-form';
export const dynamic = 'force-dynamic';

export default async function CompanyOnboardingPage() {
  const profile = await requireRole(['PROVIDER', 'ADMIN']);
  const company = await prisma.company.findFirst({ where: { ownerId: profile.id }, select: { id: true } });
  if (company) redirect('/firma/dashboard');
  return <section><h1 className="text-3xl font-semibold">Zaregistrujte firmu</h1>
    <p className="mt-2 text-muted-foreground">Po vytvorení profil čaká na overenie moderátorom. Ponuky môžete pripraviť ako koncept.</p>
    <CompanyForm/>
  </section>;
}
