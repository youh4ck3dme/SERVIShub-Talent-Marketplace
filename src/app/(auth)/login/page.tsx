'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function safeNext(value: string | null): string {
  return value && value.startsWith('/') && !value.startsWith('//') && !value.includes('\\') ? value : '/';
}
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const { error: authError } = await createClient().auth.signInWithPassword({ email, password });
      if (authError) throw new Error('Prihlásenie zlyhalo. Skontrolujte e-mail a heslo.');
      const response = await fetch('/api/auth/sync-profile', { method: 'POST', credentials: 'same-origin' });
      if (!response.ok) throw new Error('Účet sa nepodarilo pripraviť. Skúste to znova.');
      router.replace(safeNext(new URLSearchParams(window.location.search).get('next')));
      router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Nastala chyba.'); }
    finally { setBusy(false); }
  }
  return <main className="mx-auto w-full max-w-md flex-1 px-5 py-16">
    <h1 className="text-3xl font-semibold tracking-tight">Prihlásenie</h1>
    <p className="mt-2 text-sm text-muted-foreground">Prihláste sa do svojho účtu.</p>
    <form onSubmit={submit} className="mt-8 space-y-4">
      <label className="block text-sm font-medium">E-mail<input className="mt-1 w-full rounded-md border bg-background p-3" autoComplete="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label className="block text-sm font-medium">Heslo<input className="mt-1 w-full rounded-md border bg-background p-3" autoComplete="current-password" type="password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <button disabled={busy} className="w-full rounded-md bg-primary p-3 font-medium text-primary-foreground disabled:opacity-50" type="submit">{busy ? 'Prihlasovanie…' : 'Prihlásiť sa'}</button>
    </form>
    <p className="mt-6 text-sm text-muted-foreground">Nemáte účet? <Link href="/signup" className="font-semibold underline">Registrácia</Link></p>
  </main>;
}
