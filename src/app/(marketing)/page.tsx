import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
export default function HomePage() {
  return <div className="flex min-h-screen flex-col"><SiteHeader/>
    <main className="flex flex-1 flex-col justify-center bg-zinc-950 px-5 py-20 text-zinc-50">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <p className="font-mono text-xs uppercase tracking-[.3em] text-emerald-400">Nová generácia talent marketplace</p>
        <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">Práca. Projekty.<br/><span className="text-emerald-400">Ľudia, čo tvoria budúcnosť.</span></h1>
        <p className="max-w-xl text-lg text-zinc-400">Tech, AI a freelance ponuky v jednom priestore. Transparentné platy a priame spojenie s firmami.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/praca" className="rounded-md bg-emerald-400 px-6 py-4 font-semibold text-zinc-950">Preskúmať ponuky →</Link>
          <Link href="/firma/onboarding" className="rounded-md border border-zinc-700 px-6 py-4 font-semibold">Hľadám talent</Link>
        </div>
        <p className="text-sm text-zinc-500">SK / CZ · Full-time · Freelance · Remote</p>
      </div>
    </main>
  </div>;
}
