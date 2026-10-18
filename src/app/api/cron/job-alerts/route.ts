import { NextRequest,NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'node:crypto';
import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { unsubscribeSignature } from '@/lib/job-alerts/tokens';
export const runtime='nodejs';
export const dynamic='force-dynamic';

function allowed(auth:string|null):boolean {
  const secret=process.env.CRON_SECRET;
  if(!secret||secret.length<32||!auth)return false;
  const expected='Bearer '+secret;
  const a=Buffer.from(auth);const b=Buffer.from(expected);
  return a.length===b.length&&timingSafeEqual(a,b);
}
export async function GET(req:NextRequest){
  if(!allowed(req.headers.get('authorization')))return NextResponse.json({error:'Unauthorized'},{status:401});
  const apiKey=process.env.RESEND_API_KEY;
  const from=process.env.RESEND_FROM;
  const origin=process.env.NEXT_PUBLIC_APP_URL;
  if(!apiKey||!from||!origin?.startsWith('https://')||!process.env.ALERT_UNSUBSCRIBE_SECRET)
    return NextResponse.json({error:'Job alerts not configured'},{status:503});

  const now=new Date();let sent=0,processed=0,errors=0;
  const alerts=await prisma.jobAlert.findMany({where:{isActive:true},include:{profile:{select:{email:true}}},take:100});
  for(const alert of alerts){
    const period=alert.frequency==='WEEKLY'?7:1;
    if(alert.lastDeliveredAt && now.getTime()-alert.lastDeliveredAt.getTime()<period*86400000)continue;
    const until=new Date(now.getTime()+10*60000);
    const claim=await prisma.jobAlert.updateMany({where:{id:alert.id,isActive:true,OR:[{processingUntil:null},{processingUntil:{lt:now}}]},data:{processingUntil:until}});
    if(claim.count!==1)continue;
    processed++;
    try{
      const where:Prisma.JobWhereInput={
        status:'PUBLISHED',company:{is:{verification:'VERIFIED'}},
        publishedAt:{gt:alert.lastDeliveredAt||new Date(now.getTime()-period*86400000)},
        OR:[{expiresAt:null},{expiresAt:{gt:now}}],
        ...(alert.employment?{employment:alert.employment}:{}),
        ...(alert.remote?{remote:alert.remote}:{}),
        ...(alert.location?{location:{contains:alert.location,mode:'insensitive'}}:{}),
        ...(alert.query?{AND:[{OR:[
          {title:{contains:alert.query,mode:'insensitive'}},
          {description:{contains:alert.query,mode:'insensitive'}},
        ]}]}:{}),
      };
      const jobs=await prisma.job.findMany({where,orderBy:{publishedAt:'asc'},take:20});
      if(jobs.length){
        const unsubscribe=origin+'/alerts/odhlasit?id='+encodeURIComponent(alert.id)+'&sig='+unsubscribeSignature(alert.id);
        const text='Nové pracovné ponuky zo SERVIShub:\n\n'+jobs.map(j=>
          j.title+' — '+Number(j.salaryMin)+'-'+Number(j.salaryMax)+' EUR / '+j.salaryPeriod+'\n'+origin+'/praca/'+j.slug
        ).join('\n\n')+'\n\nOdhlásiť upozornenia: '+unsubscribe;
        const key=createHash('sha256').update(alert.id+'|'+jobs.map(j=>j.id).join(',')).digest('hex');
        const response=await fetch('https://api.resend.com/emails',{
          method:'POST',
          headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json','Idempotency-Key':key},
          body:JSON.stringify({from,to:[alert.profile.email],subject:'Nové ponuky pre vás · SERVIShub',text}),
        });
        if(!response.ok)throw new Error('Email provider rejected job alert: HTTP '+response.status);
        sent++;
      }
      await prisma.jobAlert.update({where:{id:alert.id},data:{lastDeliveredAt:now,processingUntil:null}});
    }catch(error){
      errors++;console.error('[cron/job-alerts] delivery failed',error);
      await prisma.jobAlert.updateMany({where:{id:alert.id},data:{processingUntil:null}});
    }
  }
  return NextResponse.json({processed,sent,errors});
}
