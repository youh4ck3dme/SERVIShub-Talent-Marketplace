'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
const schema=z.object({
  query:z.string().trim().max(100),location:z.string().trim().max(100),
  employment:z.union([z.literal(''),z.enum(['FULL_TIME','PART_TIME','CONTRACT','FREELANCE'])]),
  remote:z.union([z.literal(''),z.enum(['ONSITE','HYBRID','REMOTE'])]),
  frequency:z.enum(['DAILY','WEEKLY']),
});
export type AlertState={status:'idle'|'saved'|'error';message?:string};
export async function addJobAlert(_old:AlertState,form:FormData):Promise<AlertState>{
  const profile=await requireRole('CUSTOMER');
  const parsed=schema.safeParse({
    query:form.get('query'),location:form.get('location'),
    employment:form.get('employment'),remote:form.get('remote'),frequency:form.get('frequency'),
  });
  if(!parsed.success)return {status:'error',message:'Neplatné parametre upozornenia.'};
  const count=await prisma.jobAlert.count({where:{profileId:profile.id,isActive:true}});
  if(count>=10)return {status:'error',message:'Dosiahli ste limit 10 aktívnych upozornení.'};
  await prisma.jobAlert.create({data:{
    profileId:profile.id,query:parsed.data.query||null,location:parsed.data.location||null,
    employment:parsed.data.employment||null,remote:parsed.data.remote||null,
    frequency:parsed.data.frequency,
  }});
  revalidatePath('/kandidat/strazeny-pes');
  return {status:'saved',message:'Upozornenie uložené. E-maily sa posielajú iba po aktivovaní serverového odosielania.'};
}
export async function disableJobAlert(form:FormData):Promise<void>{
  const profile=await requireRole('CUSTOMER');
  const id=form.get('id');
  if(typeof id!=='string'||!id)return;
  await prisma.jobAlert.updateMany({where:{id,profileId:profile.id},data:{isActive:false}});
  revalidatePath('/kandidat/strazeny-pes');
}
