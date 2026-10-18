# TALENT-01 — Security release gate (review-only)

## Scope
- Removes recursive admin lookup from `profiles_select_own`.
- Enforces `requireAdminProfile` / `requireProviderProfile` on each protected layout render.
- Restricts client DML on profiles, providers, bookings, reviews, subscriptions, payments, payouts, disputes, messages, notifications.
- Limits direct provider SELECT to non-sensitive columns.

## Before applying the SQL
1. Verify migration history + current grants in **staging**, and snapshot the database.
2. Confirm backend Prisma uses a server-only DB credential (never `NEXT_PUBLIC_*`).
3. Confirm that no production feature depends on browser-side writes to the listed tables. Existing current project actions use Prisma server-side.
4. Apply Supabase SQL migration only through an approved staging migration process; later deploy only after tests.
5. If application auth uses PostgREST to read `profiles.role` as admin, migrate it to trusted server-side authorization first. Direct admin cross-user reads are intentionally removed.

## Suggested verification queries (STAGING only; read-only)

```sql
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies WHERE schemaname='public'
  AND tablename IN ('profiles','providers','subscriptions','bookings','payments','messages');

SELECT table_name, grantee, privilege_type FROM information_schema.role_table_grants
WHERE table_schema='public'
  AND table_name IN ('profiles','providers','subscriptions','payments');
```

## Negative-test matrix
- Unauthenticated user cannot access /pro or /admin.
- CUSTOMER cannot access PROVIDER nor ADMIN routes.
- PROVIDER cannot read another user's profile or update another provider's services.
- Authenticated user cannot set `profiles.role='ADMIN'`.
- Authenticated user cannot set `providers.verification_status`, `tier`, `stripe_account_id`.
- Authenticated user cannot insert/update a subscription, fake booking, review, message, payout, or payment.
- Authorized provider can still save their own profile through trusted Server Action.
- A broken Supabase config must **not** render privileged layout.

## Caveats
Passing CI **does not** imply database migration or RLS tests passed.
PostgreSQL privileges may be inherited from other roles; query `pg_has_role`, `has_table_privilege` and `has_column_privilege` on the staging DB for representative JWT roles. Confirm RLS policies are actually applied on the remote instance. The application must keep user-level ownership authorization when running through Prisma.
