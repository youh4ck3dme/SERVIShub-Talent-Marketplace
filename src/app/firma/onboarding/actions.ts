'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slug';

export type CompanyFormState = { error?: string };
const companySchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(3000),
  location: z.string().trim().max(120),
  website: z.union([z.literal(''), z.url({ protocol: /^https?$/ }).refine(url => url.length <= 300)]),
});

export async function createCompany(_previous: CompanyFormState, form: FormData): Promise<CompanyFormState> {
  const profile = await requireRole(['PROVIDER', 'ADMIN']);
  const parsed = companySchema.safeParse({
    name: form.get('name'), description: form.get('description'),
    location: form.get('location'), website: form.get('website'),
  });
  if (!parsed.success) return { error: 'Skontrolujte názov, URL a ostatné údaje.' };
  try {
    const existing = await prisma.company.findFirst({ where: { ownerId: profile.id } });
    if (existing) { redirect('/firma/dashboard'); }
    await prisma.company.create({
      data: {
        ownerId: profile.id, name: parsed.data.name,
        slug: (slugify(parsed.data.name) || 'firma') + '-' + crypto.randomUUID().slice(0, 8),
        description: parsed.data.description || null,
        location: parsed.data.location || null,
        website: parsed.data.website || null,
        members: { create: { profileId: profile.id, role: 'OWNER' } },
      },
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    console.error('[company] create failed', error);
    return { error: 'Firmu sa nepodarilo uložiť. Skúste to znova.' };
  }
  redirect('/firma/dashboard');
}
