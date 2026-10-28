import { requireAdminProfile } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { decideCompany } from './actions';
export const dynamic = 'force-dynamic';

export default async function ModerationPage() {
  await requireAdminProfile();
  const companies = await prisma.company.findMany({ where: { verification: 'PENDING' }, orderBy: { createdAt: 'asc' }, take: 100 });
  return <section className="space-y-6"><h1 className="text-2xl font-semibold">Schvaľovanie firiem</h1>
    {companies.length === 0 ? <p>Žiadne čakajúce firmy.</p> :
      <ul className="divide-y rounded-md border">{companies.map(c => <li key={c.id} className="flex flex-wrap items-center gap-4 p-4">
        <div className="mr-auto"><strong>{c.name}</strong><p className="text-sm text-muted-foreground">{c.website || c.location || 'Bez URL'}</p></div>
        <form action={decideCompany} className="flex gap-2">
          <input type="hidden" name="id" value={c.id} />
          <button name="state" value="VERIFIED" className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">Overiť</button>
          <button name="state" value="REJECTED" className="rounded-md border px-3 py-2 text-sm">Zamietnuť</button>
        </form>
      </li>)}</ul>}
  </section>;
}
