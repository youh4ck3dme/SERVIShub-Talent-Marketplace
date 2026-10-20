'use client';
import {useActionState} from 'react';
import {addJobAlert,type AlertState} from './actions';
const initial:AlertState={status:'idle'};
export function AlertForm(){
  const [state,action,busy]=useActionState(addJobAlert,initial);
  return <form action={action} className="grid gap-4 rounded-lg border p-5 sm:grid-cols-2">
    <label className="block text-sm">Kľúčové slová<input name="query" maxLength={100} className="mt-1 w-full rounded-md border bg-background p-3" placeholder="Python, AI…"/></label>
    <label className="block text-sm">Lokalita<input name="location" maxLength={100} className="mt-1 w-full rounded-md border bg-background p-3" placeholder="Bratislava, remote…"/></label>
    <label className="block text-sm">Forma práce<select name="employment" className="mt-1 w-full rounded-md border bg-background p-3">
      <option value="">Všetky</option><option value="FULL_TIME">Full-time</option><option value="PART_TIME">Part-time</option><option value="CONTRACT">Kontrakt</option><option value="FREELANCE">Freelance</option></select></label>
    <label className="block text-sm">Režim<select name="remote" className="mt-1 w-full rounded-md border bg-background p-3">
      <option value="">Všetky</option><option value="REMOTE">Remote</option><option value="HYBRID">Hybrid</option><option value="ONSITE">On-site</option></select></label>
    <label className="block text-sm">Frekvencia<select name="frequency" className="mt-1 w-full rounded-md border bg-background p-3">
      <option value="DAILY">Denne</option><option value="WEEKLY">Týždenne</option></select></label>
    {state.message&&<p role="status" className={state.status==='error'?'text-sm text-destructive':'text-sm text-emerald-600'}>{state.message}</p>}
    <button disabled={busy} className="rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-50">Pridať strážneho psa</button>
  </form>;
}
