'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
const formSchema=z.object({
  headline:z.string().trim().max(120),
  bio:z.string().trim().max(3000),
  location:z.string().trim().max(120),
  githubUrl:z.union([z.literal(''),z.url({ protocol: /^https?$/ }).refine(url => url.length <= 300)]),
  linkedinUrl:z.union([z.literal(''),z.url({ protocol: /^https?$/ }).refine(url => url.length <= 300)]),
  hourlyRate:z.union([z.literal(''),z.coerce.number().min(0).max(100000)]),
  skills:z.string().max(500).transform(s=>[...new Set(s.split(',').map(x=>x.trim()).filter(Boolean))].slice(0,25)),
});
export type CandidateState={status:'idle'|'saved'|'error';message?:string};
export async function saveCandidateProfile(_old:CandidateState,form:FormData):Promise<CandidateState>{
  const profile=await requireRole('CUSTOMER');
  const value=formSchema.safeParse({
    headline:form.get('headline'),bio:form.get('bio'),location:form.get('location'),
    githubUrl:form.get('githubUrl'),linkedinUrl:form.get('linkedinUrl'),
    hourlyRate:form.get('hourlyRate'),skills:form.get('skills')||'',
  });
  if(!value.success)return {status:'error',message:value.error.issues.map(i=>i.message).join(', ')};
  const data={
    headline:value.data.headline||null,bio:value.data.bio||null,location:value.data.location||null,
    githubUrl:value.data.githubUrl||null,linkedinUrl:value.data.linkedinUrl||null,
    hourlyRate:value.data.hourlyRate===''?null:value.data.hourlyRate,
    skills:value.data.skills,isVisible:form.get('isVisible')==='on',
  };
  try{
    await prisma.candidateProfile.upsert({where:{profileId:profile.id},create:{profileId:profile.id,...data},update:data});
    revalidatePath('/kandidat/profil');return {status:'saved',message:'Profil uložený.'};
  }catch(error){console.error('[candidate] save failed',error);return {status:'error',message:'Uloženie sa nepodarilo.'};}
}
