import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { JobForm } from '../job-form';
import { closeJob } from '../actions';
export const dynamic = 'force-dynamic';

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireRole(['PROVIDER','ADMIN']);
  const company = await prisma.company.findFirst({ where: { ownerId: profile.id }, select: { id: true } });
  if (!company) redirect('/firma/onboarding');
  const job = await prisma.job.findFirst({ where: { id, companyId: company.id } });
  if (!job) notFound();
  return <section className="space-y-6">
    <Link href="/firma/dashboard" className="text-sm underline">← Dashboard</Link>
    <div className="flex items-center justify-between"><h1 className="text-3xl font-semibold">Upraviť ponuku</h1><span className="text-sm text-muted-foreground">{job.status}</span></div>
    <Link href={"/firma/ponuky/"+job.id+"/uchadzaci"} className="inline-block rounded-md border px-4 py-2 text-sm">Zobraziť uchádzačov →</Link>
    <JobForm defaults={{
      id:job.id,title:job.title,description:job.description,employment:job.employment,
      remote:job.remote,location:job.location || '',salaryMin:String(job.salaryMin),
      salaryMax:String(job.salaryMax),salaryPeriod:job.salaryPeriod,skills:job.skills.join(', '),
    }}/>
    {job.status !== 'CLOSED' && <form action={closeJob}><input name="jobId" type="hidden" value={job.id}/><button className="text-sm text-destructive underline">Uzavrieť ponuku</button></form>}
  </section>;
}
