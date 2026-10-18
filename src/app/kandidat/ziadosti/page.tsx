import Link from 'next/link';
import {prisma} from '@/lib/prisma';
import {requireRole} from '@/lib/auth/session';
export const dynamic='force-dynamic';
export default async function ApplicationsPage(){
  const profile=await requireRole('CUSTOMER');
  const candidate=await prisma.candidateProfile.findUnique({where:{profileId:profile.id},include:{
    applications:{orderBy:{createdAt:'desc'},include:{job:{include:{company:{select:{name:true}}}}}},
  }});
  return <section className="space-y-6"><h1 className="text-3xl font-bold">Moje žiadosti</h1>
    {!candidate||candidate.applications.length===0?<p className="text-muted-foreground">Zatiaľ nemáte žiadne žiadosti. <Link href="/praca" className="underline">Nájsť prácu</Link></p>:
    <ul className="divide-y rounded-lg border">{candidate.applications.map(item=><li key={item.id} className="flex justify-between gap-4 p-4">
      <div><strong>{item.job.title}</strong><p className="text-sm text-muted-foreground">{item.job.company.name}</p></div>
      <span className="text-sm">{item.status}</span>
    </li>)}</ul>}
  </section>;
}
