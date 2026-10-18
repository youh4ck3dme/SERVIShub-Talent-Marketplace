import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getPublicJobBySlug} from '@/lib/data/jobs';
import {requireRole} from '@/lib/auth/session';
import {ApplyForm} from './apply-form';
export const dynamic='force-dynamic';
export default async function ApplyPage({params}:{params:Promise<{slug:string}>}){
  await requireRole('CUSTOMER');
  const {slug}=await params;const job=await getPublicJobBySlug(slug);
  if(!job)notFound();
  return <main className="min-h-screen bg-zinc-950 px-5 py-14 text-white">
    <div className="mx-auto max-w-2xl space-y-8">
      <Link href={'/praca/'+job.slug} className="text-sm text-emerald-400">← Späť na ponuku</Link>
      <div><p className="text-emerald-400">{job.company.name}</p><h1 className="mt-2 text-3xl font-bold">Uchádzať sa: {job.title}</h1></div>
      <ApplyForm jobId={job.id}/>
    </div>
  </main>;
}
