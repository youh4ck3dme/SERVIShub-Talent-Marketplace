import Link from 'next/link';
export default function Unsubscribed(){return <main className="mx-auto max-w-xl space-y-5 px-5 py-20">
  <h1 className="text-2xl font-semibold">Požiadavka bola spracovaná</h1>
  <p>Ak bol odkaz platný, upozornenia z daného filtra sú vypnuté.</p>
  <Link href="/praca" className="underline">Späť na pracovné ponuky</Link>
</main>}
