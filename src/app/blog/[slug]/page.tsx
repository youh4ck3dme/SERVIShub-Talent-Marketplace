import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getCmsPost,htmlToPlainText} from '@/lib/cms/wordpress';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;const {post}=await getCmsPost(slug);
  if(!post)return {title:'Článok nenájdený',robots:{index:false}};
  return {title:htmlToPlainText(post.title),description:htmlToPlainText(post.excerpt).slice(0,160),
    alternates:{canonical:'/blog/'+post.slug}};
}
export default async function BlogDetail({params}:Props){
  const {slug}=await params;const {post,available}=await getCmsPost(slug);
  if(!post&&available)notFound();
  if(!post)return <main className="mx-auto max-w-xl space-y-4 px-5 py-20"><h1 className="text-2xl font-bold">Magazín nie je dostupný</h1>
    <p>Skúste to neskôr. Pracovné ponuky nie sú výpadkom WordPressu ovplyvnené.</p><Link href="/praca" className="underline">Ponuky práce</Link></main>;
  return <main className="mx-auto max-w-3xl space-y-6 px-5 py-16">
    <Link href="/blog" className="text-sm underline">← Všetky články</Link>
    <h1 className="text-4xl font-bold">{htmlToPlainText(post.title)}</h1>
    <p className="text-sm text-muted-foreground">{post.date?new Date(post.date).toLocaleDateString('sk-SK'):''}</p>
    <article className="whitespace-pre-wrap text-lg leading-relaxed">{htmlToPlainText(post.content)}</article>
  </main>;
}
