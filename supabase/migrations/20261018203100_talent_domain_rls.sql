-- Deploy only AFTER Prisma talent domain migration, using staging validation first.
BEGIN;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;

-- Server-only mutations: Prisma BFF enforces session/tenant checks.
REVOKE INSERT, UPDATE, DELETE ON
  public.candidate_profiles, public.companies, public.company_members,
  public.jobs, public.job_applications, public.job_alerts
FROM PUBLIC, anon, authenticated;

CREATE POLICY candidate_own_read ON public.candidate_profiles FOR SELECT TO authenticated
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::text));
CREATE POLICY companies_verified_public ON public.companies FOR SELECT TO anon, authenticated
  USING (verification = 'VERIFIED');
CREATE POLICY company_members_own_read ON public.company_members FOR SELECT TO authenticated
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::text));
CREATE POLICY jobs_published_public ON public.jobs FOR SELECT TO anon, authenticated
  USING (status = 'PUBLISHED' AND (expires_at IS NULL OR expires_at > now()));
CREATE POLICY job_applications_candidate_read ON public.job_applications FOR SELECT TO authenticated
  USING (candidate_id IN (
    SELECT cp.id FROM public.candidate_profiles cp
    JOIN public.profiles p ON p.id = cp.profile_id
    WHERE p.user_id = auth.uid()::text
  ));
CREATE POLICY job_alerts_own_read ON public.job_alerts FOR SELECT TO authenticated
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::text));
COMMIT;
