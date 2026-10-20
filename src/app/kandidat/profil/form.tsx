'use client';
import {useActionState} from 'react';
import {saveCandidateProfile,type CandidateState} from './actions';
type Defaults={headline:string;bio:string;location:string;githubUrl:string;linkedinUrl:string;hourlyRate:string;skills:string;isVisible:boolean};
const initial:CandidateState={status:'idle'};
export function CandidateForm({data}:{data:Defaults}){
  const [state,action,busy]=useActionState(saveCandidateProfile,initial);
  return <form action={action} className="mt-6 max-w-xl space-y-4">
    <label className="block text-sm">Headline<input name="headline" defaultValue={data.headline} maxLength={120} className="mt-1 w-full rounded-md border bg-background p-3" placeholder="Senior Python / AI Developer"/></label>
    <label className="block text-sm">O mne<textarea name="bio" rows={6} maxLength={3000} defaultValue={data.bio} className="mt-1 w-full rounded-md border bg-background p-3"/></label>
    <label className="block text-sm">Lokalita<input name="location" maxLength={120} defaultValue={data.location} className="mt-1 w-full rounded-md border bg-background p-3"/></label>
    <label className="block text-sm">GitHub URL<input name="githubUrl" type="url" defaultValue={data.githubUrl} className="mt-1 w-full rounded-md border bg-background p-3"/></label>
    <label className="block text-sm">LinkedIn URL<input name="linkedinUrl" type="url" defaultValue={data.linkedinUrl} className="mt-1 w-full rounded-md border bg-background p-3"/></label>
    <label className="block text-sm">Hodinová sadzba (€)<input name="hourlyRate" type="number" min={0} max={100000} step="0.01" defaultValue={data.hourlyRate} className="mt-1 w-full rounded-md border bg-background p-3"/></label>
    <label className="block text-sm">Zručnosti (čiarkami)<input name="skills" maxLength={500} defaultValue={data.skills} className="mt-1 w-full rounded-md border bg-background p-3"/></label>
    <label className="flex gap-2 text-sm"><input type="checkbox" name="isVisible" defaultChecked={data.isVisible}/> Súhlasím so zverejnením môjho talent profilu, keď bude talent pool dostupný.</label>
    {state.message&&<p role="status" className={state.status==='error'?'text-destructive':'text-emerald-600'}>{state.message}</p>}
    <button disabled={busy} className="rounded-md bg-primary px-5 py-3 text-primary-foreground disabled:opacity-50">{busy?'Ukladám…':'Uložiť profil'}</button>
  </form>;
}
