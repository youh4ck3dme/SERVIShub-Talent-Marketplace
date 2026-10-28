import Link from 'next/link';
export function SiteHeader() {
  return <header className="border-b border-border bg-card"><nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4" aria-label="Hlavná navigácia">
    <Link href="/" className="text-lg font-black tracking-tight">SERVIShub.</Link>
    <div className="flex items-center gap-3 text-sm">
      <Link href="/praca" className="hover:underline">Práca</Link><Link href="/blog" className="hover:underline">Blog</Link>
      <Link href="/hladat" className="hidden hover:underline sm:inline">Služby</Link>
      <Link href="/firma/dashboard" className="hidden hover:underline sm:inline">Pre firmy</Link>
      <Link href="/login" className="hover:underline">Prihlásiť</Link>
      <Link href="/signup" className="rounded-md bg-primary px-3 py-2 font-semibold text-primary-foreground">Registrácia</Link>
    </div>
  </nav></header>;
}
