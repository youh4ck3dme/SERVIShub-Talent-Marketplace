import {unsubscribeJobAlert} from './actions';
export default async function UnsubscribePage({searchParams}:{searchParams:Promise<{id?:string;sig?:string}>}){
  const {id,sig}=await searchParams;
  return <main className="mx-auto max-w-md space-y-5 px-4 py-20">
    <h1 className="text-2xl font-semibold">Odhlásiť upozornenia</h1>
    <p>Po potvrdení prestanú chodiť e-maily z tohto uloženého filtra.</p>
    <form action={unsubscribeJobAlert}>
      <input type="hidden" name="id" value={id||''}/><input type="hidden" name="sig" value={sig||''}/>
      <button className="rounded-md bg-primary px-4 py-3 text-primary-foreground">Potvrdiť odhlásenie</button>
    </form>
  </main>;
}
