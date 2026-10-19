import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export const JOBS_PER_PAGE = 12;
export type JobFilters = {
  q?: string; location?: string; employment?: 'FULL_TIME'|'PART_TIME'|'CONTRACT'|'FREELANCE';
  remote?: 'ONSITE'|'HYBRID'|'REMOTE'; minSalary?: number; page: number;
};

function activeJobWhere(filters: Omit<JobFilters,'page'>): Prisma.JobWhereInput {
  const clauses: Prisma.JobWhereInput[] = [
    { status:'PUBLISHED' },
    { company: { is: { verification:'VERIFIED' } } },
    { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
  ];
  if (filters.q) clauses.push({ OR: [
    { title: { contains: filters.q, mode:'insensitive' } },
    { description: { contains: filters.q, mode:'insensitive' } },
    { company: { is: { name: { contains:filters.q, mode:'insensitive' } } } },
  ]});
  if (filters.location) clauses.push({ location: { contains: filters.location, mode:'insensitive' } });
  if (filters.employment) clauses.push({ employment: filters.employment });
  if (filters.remote) clauses.push({ remote: filters.remote });
  if (filters.minSalary !== undefined) clauses.push({ salaryMax: { gte: filters.minSalary } });
  return { AND: clauses };
}

export async function findPublicJobs(filters: JobFilters) {
  const page = Math.max(1, Math.min(10000, filters.page));
  // A database-free preview must not crash or pretend data exists.
  if (!process.env.DATABASE_URL) return { jobs: [], total: 0, page, totalPages: 0 };
  const where = activeJobWhere(filters);
  const [jobs,total] = await prisma.$transaction([
    prisma.job.findMany({
      where, include: { company: { select: { name:true,slug:true,logoUrl:true,location:true } } },
      orderBy: [{ publishedAt:'desc' },{ createdAt:'desc' }],
      take: JOBS_PER_PAGE, skip: (page - 1) * JOBS_PER_PAGE,
    }),
    prisma.job.count({ where }),
  ]);
  return { jobs,total,page,totalPages:Math.ceil(total / JOBS_PER_PAGE) };
}

export async function getPublicJobBySlug(slug: string) {
  if (!process.env.DATABASE_URL) return null;
  return prisma.job.findFirst({
    where: { slug, ...activeJobWhere({}) },
    include: { company: { select:{ name:true,slug:true,logoUrl:true,website:true,location:true,description:true } } },
  });
}
