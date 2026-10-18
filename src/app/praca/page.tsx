import type { Metadata } from 'next';
import Link from 'next/link';
import { findPublicJobs, JOBS_PER_PAGE } from '@/lib/data/jobs';
import type { JobFilters } from '@/lib/data/jobs';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title:'Práca, IT kontrakty a freelance projekty',
  description:'Transparentné pracovné ponuky, IT zákazky a freelance projekty na Slovensku a v Česku.',
};

type Query = Record<string,string|string[]|undefined>;
const single=(v: string|string[]|undefined)=>typeof v === 'string' ? v.trim().slice(0,100) : undefined;
function filtersOf(q:Query):JobFilters {
  const employment = single(q.employment);
  const remote = single(q.remote);
  const salary = Number(single(q.minSalary));
  const page = Number.parseInt(single(q.page)||'1',10);
  return {
    q:single(q.q),location:single(q.location),
    employment:['FULL_TIME','PART_TIME','CONTRACT','FREELANCE'].includes(employment||'') ? employment as JobFilters['employment'] : undefined,
    remote:['ONSITE','HYBRID','REMOTE'].includes(remote||'') ? remote as JobFilters['remote'] : undefined,
    minSalary:Number.isFinite(salary) && salary > 0 ? salary : undefined,
    page:Number.isFinite(page) && page > 0 ? page : 1,
  };
}
function pageUrl(q:JobFilters,page:number) {
  const params=new URLSearchParams();
  if(q.q)params.set('q',q.q);if(q.location)params.set('location',q.location);
  if(q.employment)params.set('employment',q.employment);if(q.remote)params.set('remote',q.remote);
  if(q.minSalary)params.set('minSalary',String(q.minSalary));if(page>1)params.set('page',String(page));
  return '/praca'+(params.size?'?'+params.toString():'');
}
export default async function JobsPage({searchParams}:{searchParams:Promise<Query>}) {
  const f=filtersOf(await searchParams);
  const {jobs,total,page,totalPages}=await findPublicJobs(f);
  return <div className="min-h-screen bg-zinc-950 text-zinc-50">
    <header className="border-b border-zinc-800"><nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
      <Link className="text-xl font-black tracking-tight" href="/">SERVIShub<span className="text-emerald-400">.</span></Link>
      <Link href="/firma/onboarding" className="rounded-full border border-zinc-600 px-4 py-2 text-sm hover:border-white">Pre firmy →</Link>
    </nav></header>
    <main className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Jobs · Freelance · AI</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Práca, ktorá má <span className="text-emerald-400">zmysel.</span></h1>
      <p className="mt-4 max-w-xl text-zinc-400">Skutočné ponuky, transparentné odmeny a jednoduché uchádzanie. Bez hluku.</p>
      <form method="get" action="/praca" className="mt-10 grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:grid-cols-5">
        <label className="text-xs text-zinc-400 md:col-span-2">Pozícia alebo technológia
          <input name="q" defaultValue={f.q||''} placeholder="Python, React, AI…" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-3 text-white" /></label>
        <label className="text-xs text-zinc-400">Lokalita
          <input name="location" defaultValue={f.location||''} placeholder="Remote / Bratislava" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-3 text-white" /></label>
        <label className="text-xs text-zinc-400">Forma spolupráce
          <select name="employment" defaultValue={f.employment||''} className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-3 text-white">
            <option value="">Všetky</option><option value="FULL_TIME">Full-time</option><option value="PART_TIME">Part-time</option><option value="CONTRACT">Kontrakt</option><option value="FREELANCE">Freelance</option>
          </select></label>
        <div className="flex items-end"><button className="w-full rounded-md bg-emerald-400 px-4 py-3 font-bold text-zinc-950 hover:bg-emerald-300">Hľadať →</button></div>
        <label className="text-xs text-zinc-400">Práca na diaľku
          <select name="remote" defaultValue={f.remote||''} className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-3 text-white"><option value="">Všetko</option><option value="REMOTE">Remote</option><option value="HYBRID">Hybrid</option><option value="ONSITE">On-site</option></select></label>
        <label className="text-xs text-zinc-400">Min. odmena (€)
          <input name="minSalary" type="number" min="0" defaultValue={f.minSalary||''} className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-3 text-white" /></label>
      </form>
      <div className="my-7 flex items-center justify-between"><h2 className="font-semibold">{total} pracovných ponúk</h2><span className="text-sm text-zinc-500">Strana {page} / {Math.max(1,totalPages)}</span></div>
      <div className="space-y-3">{jobs.map(job=><article key={job.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-emerald-500">
        <Link href={'/praca/'+job.slug} className="block">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><p className="text-sm text-emerald-400">{job.company.name}</p><h3 className="mt-2 text-xl font-bold">{job.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{job.location||'Lokalita podľa dohody'} · {job.remote} · {job.employment}</p></div>
            <strong className="text-lg text-white">{Number(job.salaryMin).toLocaleString('sk-SK')} – {Number(job.salaryMax).toLocaleString('sk-SK')} € / {job.salaryPeriod.toLowerCase()}</strong>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">{job.skills.slice(0,8).map(s=><span key={s} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">{s}</span>)}</div>
        </Link>
      </article>)}</div>
      {jobs.length===0&&<p className="rounded-xl border border-zinc-800 p-10 text-center text-zinc-400">Zatiaľ žiadne ponuky pre zvolené filtre.</p>}
      <div className="mt-8 flex gap-3">{page>1&&<Link href={pageUrl(f,page-1)} className="rounded-md border border-zinc-700 px-4 py-2">← Predchádzajúca</Link>}
        {page<totalPages&&<Link href={pageUrl(f,page+1)} className="rounded-md border border-zinc-700 px-4 py-2">Ďalšia →</Link>}</div>
      <p className="mt-3 text-xs text-zinc-500">Strana zobrazuje najviac {JOBS_PER_PAGE} aktuálne zverejnených ponúk.</p>
    </main>
  </div>;
}
