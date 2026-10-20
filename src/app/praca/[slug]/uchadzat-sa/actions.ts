'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export type ApplyState={status:'idle'|'sent'|'error';message?:string};
const schema=z.object({jobId:z.string().min(10).max(100),coverLetter:z.string().trim().min(30).max(4000)});
export async function applyForJob(_old:ApplyState,form:FormData):Promise<ApplyState>{
  const profile=await requireRole('CUSTOMER',{next:'/kandidat/profil'});
  const parsed=schema.safeParse({jobId:form.get('jobId'),coverLetter:form.get('coverLetter')});
  if(!parsed.success)return {status:'error',message:'Napíšte sprievodný text (30–4000 znakov).'};
  const job=await prisma.job.findFirst({
    where:{id:parsed.data.jobId,status:'PUBLISHED',
      company:{is:{verification:'VERIFIED'}},
      OR:[{expiresAt:null},{expiresAt:{gt:new Date()}}],
    },
    select:{id:true},
  });
  if(!job)return {status:'error',message:'Táto ponuka už nie je dostupná.'};
  try {
    await prisma.$transaction(async tx=>{
      const candidate=await tx.candidateProfile.upsert({
        where:{profileId:profile.id},create:{profileId:profile.id},update:{},
      });
      await tx.jobApplication.create({data:{jobId:job.id,candidateId:candidate.id,coverLetter:parsed.data.coverLetter}});
    });
  }catch(error){
    if(error && typeof error==='object' && 'code' in error && error.code==='P2002')
      return {status:'error',message:'Na túto ponuku ste sa už prihlásili.'};
    console.error('[jobApplication] failed',error);
    return {status:'error',message:'Odoslanie žiadosti zlyhalo. Skúste to znova.'};
  }
  revalidatePath('/kandidat/ziadosti');
  return {status:'sent',message:'Žiadosť bola uložená. Firma ju nájde vo svojom dashboarde.'};
}
