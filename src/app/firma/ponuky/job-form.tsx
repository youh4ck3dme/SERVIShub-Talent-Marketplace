'use client';

import { useActionState } from 'react';
import { saveJob, type JobFormState } from './actions';

export type JobFormDefaults = {
  id?: string; title?: string; description?: string;
  employment?: string; remote?: string; location?: string;
  salaryMin?: string; salaryMax?: string; salaryPeriod?: string; skills?: string;
};
const initial: JobFormState = {};
const employments = [['FULL_TIME','Plný úväzok'],['PART_TIME','Skrátený úväzok'],['CONTRACT','Kontrakt'],['FREELANCE','Freelance']];
const remotes = [['REMOTE','Remote'],['HYBRID','Hybrid'],['ONSITE','Na pracovisku']];
const periods = [['MONTH','Za mesiac'],['HOUR','Za hodinu'],['YEAR','Za rok'],['FIXED','Za projekt']];

export function JobForm({ defaults = {} }: { defaults?: JobFormDefaults }) {
  const [state, action, busy] = useActionState(saveJob, initial);
  return <form action={action} className="max-w-2xl space-y-4">
    {defaults.id && <input type="hidden" name="jobId" value={defaults.id} />}
    <label className="block text-sm font-medium">Pozícia / projekt<input name="title" minLength={5} maxLength={120} required defaultValue={defaults.title} className="mt-1 w-full rounded-md border bg-background p-3" /></label>
    <label className="block text-sm font-medium">Popis práce<textarea name="description" minLength={30} maxLength={20000} required rows={9} defaultValue={defaults.description} className="mt-1 w-full rounded-md border bg-background p-3" /></label>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium">Forma práce<select name="employment" defaultValue={defaults.employment || 'FULL_TIME'} className="mt-1 w-full rounded-md border bg-background p-3">{employments.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="text-sm font-medium">Režim<select name="remote" defaultValue={defaults.remote || 'REMOTE'} className="mt-1 w-full rounded-md border bg-background p-3">{remotes.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="text-sm font-medium">Mesto / lokalita<input name="location" maxLength={120} defaultValue={defaults.location} className="mt-1 w-full rounded-md border bg-background p-3" /></label>
      <label className="text-sm font-medium">Jednotka odmeny<select name="salaryPeriod" defaultValue={defaults.salaryPeriod || 'MONTH'} className="mt-1 w-full rounded-md border bg-background p-3">{periods.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="text-sm font-medium">Odmena od (€)<input name="salaryMin" type="number" min={0} max={10000000} step="0.01" required defaultValue={defaults.salaryMin} className="mt-1 w-full rounded-md border bg-background p-3" /></label>
      <label className="text-sm font-medium">Odmena do (€)<input name="salaryMax" type="number" min={0} max={10000000} step="0.01" required defaultValue={defaults.salaryMax} className="mt-1 w-full rounded-md border bg-background p-3" /></label>
    </div>
    <label className="block text-sm font-medium">Zručnosti (oddeľte čiarkami)<input name="skills" maxLength={500} defaultValue={defaults.skills} placeholder="TypeScript, Python, AI" className="mt-1 w-full rounded-md border bg-background p-3" /></label>
    {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
    <div className="flex flex-wrap gap-3">
      <button disabled={busy} name="intent" value="draft" type="submit" className="rounded-md border px-5 py-3 disabled:opacity-50">Uložiť koncept</button>
      <button disabled={busy} name="intent" value="publish" type="submit" className="rounded-md bg-primary px-5 py-3 text-primary-foreground disabled:opacity-50">Publikovať na 30 dní</button>
    </div>
    <p className="text-xs text-muted-foreground">Zverejnenie vyžaduje overenú firmu. Platové rozpätie je povinné.</p>
  </form>;
}
