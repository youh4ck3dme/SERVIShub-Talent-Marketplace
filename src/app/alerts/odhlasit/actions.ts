'use server';
import {redirect} from 'next/navigation';
import {prisma} from '@/lib/prisma';
import {verifyUnsubscribeSignature} from '@/lib/job-alerts/tokens';
export async function unsubscribeJobAlert(form:FormData):Promise<void>{
  const id=form.get('id');const sig=form.get('sig');
  if(typeof id!=='string'||typeof sig!=='string'||id.length>100||!verifyUnsubscribeSignature(id,sig)){
    redirect('/alerts/odhlasene?status=invalid');
  }
  await prisma.jobAlert.updateMany({where:{id},data:{isActive:false}});
  redirect('/alerts/odhlasene');
}
