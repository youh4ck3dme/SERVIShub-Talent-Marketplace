'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function logout() {
    setBusy(true); setError('');
    const { error } = await createClient().auth.signOut();
    if (error) { setBusy(false); setError('Odhlásenie zlyhalo.'); return; }
    router.replace('/login');
    router.refresh();
  }
  return <div className="flex items-center gap-2">
    {error && <span role="alert" className="text-xs text-destructive">{error}</span>}
    <button type="button" className="rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50" onClick={logout} disabled={busy}>{busy ? 'Odhlasovanie…' : 'Odhlásiť sa'}</button>
  </div>;
}
