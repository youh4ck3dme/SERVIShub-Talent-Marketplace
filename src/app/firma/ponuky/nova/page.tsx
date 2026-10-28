import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { JobForm } from '../job-form';
export const dynamic = 'force-dynamic';
export default async function NewJobPage() {
  await requireRole(['PROVIDER','ADMIN']);
  return <section className="space-y-6"><Link href="/firma/dashboard" className="text-sm underline">← Dashboard</Link><h1 className="text-3xl font-semibold">Nová ponuka</h1><JobForm/></section>;
}
