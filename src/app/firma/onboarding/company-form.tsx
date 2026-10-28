'use client';

import { useActionState } from 'react';
import { createCompany, type CompanyFormState } from './actions';

const initialState: CompanyFormState = {};
export function CompanyForm() {
  const [state, action, busy] = useActionState(createCompany, initialState);
  return <form action={action} className="mt-6 max-w-xl space-y-4">
    <label className="block text-sm font-medium">Názov firmy<input name="name" required minLength={2} maxLength={120} className="mt-1 w-full rounded-md border bg-background p-3" /></label>
    <label className="block text-sm font-medium">Web (voliteľné)<input name="website" type="url" maxLength={300} className="mt-1 w-full rounded-md border bg-background p-3" placeholder="https://firma.sk" /></label>
    <label className="block text-sm font-medium">Lokalita<input name="location" maxLength={120} className="mt-1 w-full rounded-md border bg-background p-3" placeholder="Bratislava / Remote" /></label>
    <label className="block text-sm font-medium">O firme<textarea name="description" maxLength={3000} rows={5} className="mt-1 w-full rounded-md border bg-background p-3" /></label>
    {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
    <button disabled={busy} className="rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground disabled:opacity-50">{busy ? 'Ukladám…' : 'Vytvoriť firemný profil'}</button>
  </form>;
}
