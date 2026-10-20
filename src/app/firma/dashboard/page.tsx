import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export default async function EmployerDashboard() {
  const profile = await requireRole(['PROVIDER','ADMIN']);
  const company = await prisma.company.findFirst({
    where: { ownerId: profile.id },
    include: { jobs: { orderBy: { createdAt: 'desc' }, take: 20 } },
  });
  if (!company) redirect('/firma/onboarding');
  return <section className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-3xl font-semibold">{company.name}</h1>
        <p className="mt-1 text-muted-foreground">Overenie: {company.verification === 'VERIFIED' ? 'Overená' : company.verification === 'PENDING' ? 'Čaká na schválenie' : 'Zamietnutá'}</p>
      </div>
      <Link href="/firma/ponuky/nova" className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Pridať ponuku</Link>
    </div>
    <h2 className="text-xl font-semibold">Pracovné ponuky ({company.jobs.length})</h2>
    {company.jobs.length === 0 ? <p className="text-muted-foreground">Zatiaľ nemáte žiadnu ponuku. Pridajte prvú.</p> :
      <ul className="divide-y rounded-md border">{company.jobs.map(job => <li key={job.id} className="flex justify-between gap-4 p-4">
        <Link className="font-medium underline" href={'/firma/ponuky/' + job.id}>{job.title}</Link>
        <span className="text-xs text-muted-foreground">{job.status}</span></li>)}</ul>}
  </section>;
}
