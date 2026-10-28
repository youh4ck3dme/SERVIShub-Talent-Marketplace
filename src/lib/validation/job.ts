import { z } from 'zod';

const requiredPrice = z.preprocess(
  value => value === '' || value === null || value === undefined ? Number.NaN : value,
  z.coerce.number().min(0).max(10000000),
);

export const jobFormSchema = z.object({
  title: z.string().trim().min(5, 'Názov musí mať aspoň 5 znakov.').max(120),
  description: z.string().trim().min(30, 'Popis musí mať aspoň 30 znakov.').max(20000),
  employment: z.enum(['FULL_TIME','PART_TIME','CONTRACT','FREELANCE']),
  remote: z.enum(['ONSITE','HYBRID','REMOTE']),
  location: z.string().trim().max(120),
  salaryMin: requiredPrice,
  salaryMax: requiredPrice,
  salaryPeriod: z.enum(['HOUR','MONTH','YEAR','FIXED']),
  skills: z.string().max(500).transform(x => [...new Set(x.split(',').map(s => s.trim()).filter(Boolean))].slice(0, 20)),
}).refine(x => x.salaryMax >= x.salaryMin, { path:['salaryMax'],message:'Maximálna mzda nesmie byť nižšia ako minimálna.' });
export type JobFormValues = z.infer<typeof jobFormSchema>;
