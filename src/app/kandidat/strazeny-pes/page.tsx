import {prisma} from '@/lib/prisma';
import {requireRole} from '@/lib/auth/session';
import {AlertForm} from './alert-form';
import {disableJobAlert} from './actions';
export const dynamic='force-dynamic';
export default async function JobAlertsPage(){
  const profile=await requireRole('CUSTOMER');
  const alerts=await prisma.jobAlert.findMany({where:{profileId:profile.id},orderBy:{createdAt:'desc'},take:30});
  return <section className="space-y-6">
    <h1 className="text-3xl font-semibold">Strážny pes ponúk</h1>
    <p className="text-muted-foreground">Uložte si filtre. Po nastavení Resend a cron úlohy vám budú chodiť nové relevantné ponuky.</p>
    <AlertForm/>
    <h2 className="text-xl font-semibold">Moje upozornenia</h2>
    {alerts.length===0?<p>Nemáte zatiaľ žiadne upozornenia.</p>:
    <ul className="divide-y rounded-lg border">{alerts.map(a=><li key={a.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
      <div><strong>{a.query||'Všetky pozície'}</strong><p className="text-sm text-muted-foreground">{a.location||'Všetky lokality'} · {a.frequency} · {a.isActive?'Aktívne':'Vypnuté'}</p></div>
      {a.isActive&&<form action={disableJobAlert}><input type="hidden" name="id" value={a.id}/><button className="text-sm text-destructive underline">Vypnúť</button></form>}
    </li>)}</ul>}
  </section>;
}
