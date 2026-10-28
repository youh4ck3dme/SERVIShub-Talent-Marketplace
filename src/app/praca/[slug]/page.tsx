import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicJobBySlug } from '@/lib/data/jobs';
export const dynamic = 'force-dynamic';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;const job=await getPublicJobBySlug(slug);
  if(!job)return {title:'Ponuka neexistuje',robots:{index:false}};
  return {title:job.title,description:job.description.slice(0,160),
    alternates:{canonical:'/praca/'+job.slug},
    openGraph:{title:job.title,description:job.description.slice(0,160),type:'website'}};
}
export default async function JobDetail({params}:Props) {
  const {slug}=await params;const job=await getPublicJobBySlug(slug);
  if(!job)notFound();
  const url=(process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000').replace(/\/$/,'')+'/praca/'+job.slug;
  const schema={
    '@context':'https://schema.org','@type':'JobPosting',
    title:job.title,description:job.description,
    datePosted:job.publishedAt?.toISOString(),
    validThrough:job.expiresAt?.toISOString(),
    hiringOrganization:{'@type':'Organization',name:job.company.name,sameAs:job.company.website||undefined},
    employmentType:job.employment==='FREELANCE'?'CONTRACTOR':job.employment,
    ...(job.location?{jobLocation:{'@type':'Place',address:{'@type':'PostalAddress',addressLocality:job.location,addressCountry:'SK'}}}:{}),
    ...(job.remote==='REMOTE'?{jobLocationType:'TELECOMMUTE'}:{}),
    baseSalary:{'@type':'MonetaryAmount',currency:job.currency,value:{'@type':'QuantitativeValue',minValue:Number(job.salaryMin),maxValue:Number(job.salaryMax),unitText:job.salaryPeriod==='HOUR'?'HOUR':job.salaryPeriod==='YEAR'?'YEAR':job.salaryPeriod==='MONTH'?'MONTH':'PROJECT'}},
    url,
  };
  const json=JSON.stringify(schema).replace(/</g,'\\u003c');
  return <div className="min-h-screen bg-zinc-950 text-zinc-50"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:json}}/>
    <main className="mx-auto max-w-4xl space-y-8 px-5 py-12">
      <Link href="/praca" className="text-sm text-emerald-400">← Späť na ponuky</Link>
      <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <p className="text-emerald-400">{job.company.name}</p>
        <h1 className="text-4xl font-bold tracking-tight">{job.title}</h1>
        <p className="text-zinc-400">{job.location||'Podľa dohody'} · {job.remote} · {job.employment}</p>
        <p className="text-2xl font-semibold">{Number(job.salaryMin).toLocaleString('sk-SK')} – {Number(job.salaryMax).toLocaleString('sk-SK')} € / {job.salaryPeriod.toLowerCase()}</p>
        <div className="flex flex-wrap gap-2">{job.skills.map(s=><span key={s} className="rounded-full bg-zinc-800 px-3 py-1 text-sm">{s}</span>)}</div>
      </section>
      <article className="whitespace-pre-wrap rounded-2xl border border-zinc-800 p-8 leading-relaxed text-zinc-200">{job.description}</article>
      <Link href={'/praca/'+job.slug+'/uchadzat-sa'} className="inline-block rounded-md bg-emerald-400 px-6 py-3 font-semibold text-zinc-950">Uchádzať sa →</Link>
      <p className="text-sm text-zinc-500">Odpoveď bude doručená firme po odoslaní žiadosti.</p>
    </main></div>;
}
