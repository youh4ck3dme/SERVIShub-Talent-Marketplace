-- Security release candidate: least-privilege client access (review before applying)
-- Depends on all earlier Prisma + Supabase migrations.
-- Server-side Prisma operations must use a trusted database role and enforce RBAC.
BEGIN;

-- Remove self-referencing subquery: recursive RLS rules can make profiles unreadable.
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid()::text);
-- Admins use the server-side trusted API. Do not grant blanket profiles SELECT.

-- RLS checks which rows are eligible, not which columns may be modified.
-- Prevent users from promoting themselves or forging verified/paid state.
REVOKE UPDATE ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
GRANT UPDATE (full_name, phone, avatar_url, locale)
  ON TABLE public.profiles TO authenticated;

REVOKE INSERT, UPDATE, DELETE ON TABLE public.providers
  FROM PUBLIC, anon, authenticated;
-- Provider self-service goes through the authenticated server actions.
-- Public provider SELECT is column-scoped; avoid exposing KYC, insurance and Stripe refs.
REVOKE SELECT ON TABLE public.providers FROM PUBLIC, anon, authenticated;
GRANT SELECT (
  id, profile_id, business_name, slug, bio, ico, dic, city, postal_code,
  lat, lng, tier, verification_status, insurance_verified,
  rating_avg, rating_count, is_active, created_at, updated_at
) ON TABLE public.providers TO anon, authenticated;

-- Monetary and administrative state is never client-authoritative.
REVOKE INSERT, UPDATE, DELETE ON TABLE public.subscriptions
  FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.payments
  FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.payouts
  FROM PUBLIC, anon, authenticated;

-- Keep read policies but move operations with business invariants to server.
REVOKE INSERT, UPDATE, DELETE ON TABLE public.bookings
  FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.reviews
  FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.disputes
  FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.messages
  FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.notifications
  FROM PUBLIC, anon, authenticated;

COMMIT;
