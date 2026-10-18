-- Real PostgreSQL role/JWT-negative tests. Requires all Supabase migrations.
BEGIN;
INSERT INTO public.profiles (id,user_id,email,full_name,role,updated_at)
VALUES
 ('audit-profile-a','00000000-0000-4000-a000-000000000001','audit-a@example.test','A','CUSTOMER',now()),
 ('audit-profile-b','00000000-0000-4000-a000-000000000002','audit-b@example.test','B','CUSTOMER',now());

-- These checks apply to the intended API roles, not DB owner.
DO $$
BEGIN
  IF has_column_privilege('authenticated','public.profiles','role','UPDATE') THEN
    RAISE EXCEPTION 'role escalation: profile role writable by authenticated';
  END IF;
  IF has_column_privilege('authenticated','public.providers','stripe_account_id','SELECT') THEN
    RAISE EXCEPTION 'KYC/Stripe private columns visible to authenticated';
  END IF;
  IF has_table_privilege('authenticated','public.subscriptions','UPDATE') THEN
    RAISE EXCEPTION 'subscription data client writable';
  END IF;
  IF has_table_privilege('authenticated','public.job_applications','INSERT') THEN
    RAISE EXCEPTION 'direct application insertion permitted';
  END IF;
END $$;

SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-4000-a000-000000000001',true);
DO $$
DECLARE n integer;
BEGIN
  SELECT count(*) INTO n FROM public.profiles;
  IF n <> 1 THEN RAISE EXCEPTION 'profiles RLS: expected 1 row, got %', n; END IF;
END $$;
RESET ROLE;
ROLLBACK;
