'use client';
import Link from 'next/link';
import {useActionState} from 'react';
import {applyForJob,type ApplyState} from './actions';
const initial:ApplyState={status:'idle'};
export function ApplyForm({jobId}:{jobId:string}){
  const [state,action,busy]=useActionState(applyForJob,initial);
  if(state.status==='sent')return <div role="status" className="rounded-xl border border-emerald-400/50 p-6">
    <h2 className="text-xl font-semibold text-emerald-400">Žiadosť odoslaná</h2>
    <p className="mt-2">{state.message}</p>
    <Link href="/kandidat/ziadosti" className="mt-5 inline-block underline">Moje žiadosti →</Link>
  </div>;
  return <form action={action} className="space-y-5">
    <input type="hidden" name="jobId" value={jobId}/>
    <label className="block text-sm">Sprievodný text
      <textarea name="coverLetter" required rows={9} minLength={30} maxLength={4000} className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-900 p-3 text-white" placeholder="Napíšte, prečo ste vhodný kandidát…"/>
    </label>
    <p className="text-xs text-zinc-400">Odoslaním poskytnete svoj profil, e-mail a sprievodný text firme z tejto ponuky. Nahrávanie CV zatiaľ nie je dostupné bez bezpečnostného skenovania súborov.</p>
    {state.message&&<p role="alert" className="text-sm text-rose-400">{state.message}</p>}
    <button disabled={busy} className="rounded-md bg-emerald-400 px-6 py-3 font-bold text-zinc-950 disabled:opacity-50">{busy?'Odosielam…':'Odoslať žiadosť'}</button>
  </form>;
}
