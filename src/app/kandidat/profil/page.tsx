import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { CandidateForm } from './form';
export const dynamic = 'force-dynamic';
export default async function CandidateProfilePage(){
  const profile=await requireRole('CUSTOMER');
  const candidate=await prisma.candidateProfile.findUnique({where:{profileId:profile.id}});
  return <section><h1 className="text-3xl font-semibold">Môj profil</h1>
    <p className="mt-2 text-muted-foreground">Zručnosti a kontakty k vašim pracovným žiadostiam. Viditeľnosť je východiskovo vypnutá.</p>
    <CandidateForm data={{
      headline:candidate?.headline||'',bio:candidate?.bio||'',location:candidate?.location||'',
      githubUrl:candidate?.githubUrl||'',linkedinUrl:candidate?.linkedinUrl||'',
      hourlyRate:candidate?.hourlyRate?String(candidate.hourlyRate):'',
      skills:candidate?.skills.join(', ')||'',isVisible:candidate?.isVisible||false,
    }}/>
  </section>;
}
