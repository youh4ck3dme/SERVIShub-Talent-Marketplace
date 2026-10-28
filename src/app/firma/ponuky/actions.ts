'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { slugify } from '@/lib/slug';
import { jobFormSchema } from '@/lib/validation/job';

export type JobFormState = { error?: string };

export async function saveJob(_previous: JobFormState, form: FormData): Promise<JobFormState> {
  const profile = await requireRole(['PROVIDER','ADMIN']);
  const company = await prisma.company.findFirst({ where: { ownerId: profile.id } });
  if (!company) redirect('/firma/onboarding');

  const parsed = jobFormSchema.safeParse({
    title: form.get('title'), description: form.get('description'),
    employment: form.get('employment'), remote: form.get('remote'),
    location: form.get('location'), salaryMin: form.get('salaryMin'),
    salaryMax: form.get('salaryMax'), salaryPeriod: form.get('salaryPeriod'),
    skills: form.get('skills') ?? '',
  });
  if (!parsed.success) {
    return { error: parsed.error.issues.map(x => x.message).join(' ') };
  }

  const publishing = form.get('intent') === 'publish';
  if (publishing && company.verification !== 'VERIFIED') {
    return { error: 'Firmu musí pred zverejnením ponuky schváliť administrátor.' };
  }

  const jobId = form.get('jobId');
  const data = { ...parsed.data, location: parsed.data.location || null };
  try {
    if (typeof jobId === 'string' && jobId) {
      const existing = await prisma.job.findFirst({ where: { id: jobId, companyId: company.id } });
      if (!existing) return { error: 'Ponuka neexistuje alebo k nej nemáte prístup.' };
      await prisma.job.update({
        where: { id: existing.id },
        data: {
          ...data,
          ...(publishing ? {
            status: 'PUBLISHED' as const,
            publishedAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 86400000),
          } : {}),
        },
      });
    } else {
      await prisma.job.create({
        data: {
          ...data, companyId: company.id, currency: 'EUR',
          slug: (slugify(parsed.data.title) || 'ponuka') + '-' + crypto.randomUUID().slice(0, 8),
          status: publishing ? 'PUBLISHED' : 'DRAFT',
          ...(publishing ? { publishedAt: new Date(), expiresAt: new Date(Date.now() + 30 * 86400000) } : {}),
        },
      });
    }
  } catch (error) {
    console.error('[firma/ponuky] save failed', error);
    return { error: 'Uloženie ponuky zlyhalo. Skúste to znova.' };
  }

  revalidatePath('/firma/dashboard');
  revalidatePath('/praca');
  redirect('/firma/dashboard');
}

export async function closeJob(form: FormData): Promise<void> {
  const profile = await requireRole(['PROVIDER','ADMIN']);
  const company = await prisma.company.findFirst({ where: { ownerId: profile.id }, select: { id: true } });
  const jobId = form.get('jobId');
  if (!company || typeof jobId !== 'string' || !jobId) return;
  await prisma.job.updateMany({
    where: { id: jobId, companyId: company.id },
    data: { status: 'CLOSED' },
  });
  revalidatePath('/firma/dashboard');
  revalidatePath('/praca');
}
