'use server';
import { revalidatePath } from 'next/cache';
import { requireAdminProfile } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export async function decideCompany(form: FormData): Promise<void> {
  await requireAdminProfile();
  const id = form.get('id');
  const state = form.get('state');
  if (typeof id !== 'string' || !id || (state !== 'VERIFIED' && state !== 'REJECTED')) return;
  await prisma.company.update({ where: { id }, data: { verification: state } });
  revalidatePath('/admin/firmy');
  revalidatePath('/firma/dashboard');
}
