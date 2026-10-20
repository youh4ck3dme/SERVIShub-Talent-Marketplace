import type {Metadata} from 'next';
import Link from 'next/link';
import {SiteHeader} from '@/components/site-header';
import {listCmsPosts,htmlToPlainText} from '@/lib/cms/wordpress';
export const metadata:Metadata={title:'Magazín & príbehy',description:'Články o práci, technológiách a freelancingu.'};
export default async function BlogPage() {
  const {posts,available}=await listCmsPosts();
  return <div className="min-h-screen bg-background"><SiteHeader/><main className="mx-auto max-w-5xl px-5 py-14">
    <p className="font-mono text-xs uppercase tracking-widest text-primary">Editorial · Tech · AI</p>
    <h1 className="mt-3 text-4xl font-bold">Magazín</h1>
    {!available&&<p role="status" className="mt-6 rounded-md border p-5 text-muted-foreground">Redakčný obsah je dočasne nedostupný. Pracovné ponuky fungujú nezávisle.</p>}
    {available&&posts.length===0&&<p className="mt-6 text-muted-foreground">Zatiaľ žiadne publikované články.</p>}
    <div className="mt-8 grid gap-4 md:grid-cols-2">{posts.map(p=><article key={p.id} className="rounded-xl border p-6">
      <p className="text-xs text-muted-foreground">{p.date?new Date(p.date).toLocaleDateString('sk-SK'):''}</p>
      <h2 className="mt-3 text-xl font-semibold"><Link className="hover:underline" href={'/blog/'+p.slug}>{htmlToPlainText(p.title)}</Link></h2>
      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{htmlToPlainText(p.excerpt)}</p>
      <Link href={'/blog/'+p.slug} className="mt-4 inline-block text-sm font-semibold underline">Čítať článok →</Link>
    </article>)}</div>
  </main></div>;
}
