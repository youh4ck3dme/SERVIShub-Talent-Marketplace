'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [kind, setKind] = useState<'candidate' | 'employer'>('candidate');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const { error } = await createClient().auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin + '/auth/callback', data: { full_name: fullName, account_type: kind } },
      });
      if (error) throw new Error(error.message);
      setSuccess(true);
      setMessage('Skontrolujte si e-mail. Potvrďte registráciu a následne sa prihláste.');
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Registrácia zlyhala.'); }
    finally { setBusy(false); }
  }
  return <main className="mx-auto w-full max-w-md flex-1 px-5 py-16">
    <h1 className="text-3xl font-semibold tracking-tight">Vytvoriť účet</h1>
    <p className="mt-2 text-sm text-muted-foreground">Jedno konto pre prácu aj freelance projekty.</p>
    <form onSubmit={submit} className="mt-8 space-y-4">
      <fieldset><legend className="mb-2 text-sm font-medium">Registrujem sa ako</legend>
        <div className="flex gap-4">
          <label className="flex items-center gap-2"><input type="radio" name="kind" checked={kind === 'candidate'} onChange={() => setKind('candidate')}/> Kandidát</label>
          <label className="flex items-center gap-2"><input type="radio" name="kind" checked={kind === 'employer'} onChange={() => setKind('employer')}/> Firma</label>
        </div>
      </fieldset>
      <label className="block text-sm font-medium">Meno<input className="mt-1 w-full rounded-md border bg-background p-3" autoComplete="name" required minLength={2} maxLength={120} value={fullName} onChange={e => setFullName(e.target.value)} /></label>
      <label className="block text-sm font-medium">E-mail<input className="mt-1 w-full rounded-md border bg-background p-3" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label className="block text-sm font-medium">Heslo (aspoň 8 znakov)<input className="mt-1 w-full rounded-md border bg-background p-3" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} /></label>
      {message && <p role="status" className={success ? 'text-sm text-emerald-600' : 'text-sm text-destructive'}>{message}</p>}
      <button disabled={busy || success} className="w-full rounded-md bg-primary p-3 font-medium text-primary-foreground disabled:opacity-50" type="submit">{busy ? 'Registrácia…' : 'Vytvoriť účet'}</button>
    </form>
    <p className="mt-6 text-sm text-muted-foreground">Už máte účet? <Link href="/login" className="font-semibold underline">Prihlásenie</Link></p>
  </main>;
}
