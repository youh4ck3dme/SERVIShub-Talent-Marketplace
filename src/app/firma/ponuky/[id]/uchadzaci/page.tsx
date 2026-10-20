import Link from 'next/link';
import {notFound} from 'next/navigation';
import {prisma} from '@/lib/prisma';
import {requireRole} from '@/lib/auth/session';
export const dynamic='force-dynamic';
export default async function ApplicantsPage({params}:{params:Promise<{id:string}>}){
  const profile=await requireRole(['PROVIDER','ADMIN']);
  const {id}=await params;
  const company=await prisma.company.findFirst({where:{ownerId:profile.id},select:{id:true}});
  if(!company)notFound();
  const job=await prisma.job.findFirst({where:{id,companyId:company.id},
    include:{applications:{orderBy:{createdAt:'desc'},include:{candidate:{include:{profile:{select:{email:true,fullName:true}}}}}}}});
  if(!job)notFound();
  return <section className="space-y-6">
    <Link href={'/firma/ponuky/'+job.id} className="text-sm underline">← Ponuka</Link>
    <h1 className="text-3xl font-semibold">Uchádzači: {job.title}</h1>
    {job.applications.length===0?<p className="text-muted-foreground">Zatiaľ nikto neposlal žiadosť.</p>:
    <ul className="divide-y rounded-lg border">{job.applications.map(a=><li key={a.id} className="space-y-2 p-5">
      <div className="flex justify-between gap-3"><div><strong>{a.candidate.profile.fullName||'Kandidát'}</strong>
        <p className="text-sm text-muted-foreground">{a.candidate.profile.email}</p></div><span className="text-sm">{a.status}</span></div>
      <p className="text-sm">{a.candidate.headline}</p><p className="whitespace-pre-wrap text-sm">{a.coverLetter}</p>
    </li>)}</ul>}
  </section>;
}
