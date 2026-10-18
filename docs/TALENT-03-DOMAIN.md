# TALENT-03 — Schema and rollout

- Preserve original Profile / Provider / Service / Booking tables and data; new models are additive.
- Auth passwords live exclusively in Supabase Auth, no app password hash.
- Candidate is CUSTOMER; Employer is PROVIDER at the existing `Profile.role` level. CompanyMember enforces employer organization membership.
- Jobs require explicit salary min/max + currency/period; job status defaults DRAFT.
- Candidate profiles private unless explicit future talent-pool opt-in (RLS currently only owner).
- All business mutations go through authenticated Prisma server actions (no PostgREST INSERT/UPDATE/DELETE).

## Staging-only sequence
1. Snapshot schema+data.
2. Run `pnpm exec prisma validate` and `pnpm exec prisma migrate deploy` with DIRECT_URL.
3. Apply Supabase RLS migrations, including prior TALENT-01 security grants.
4. Test anon/candidate/employer access with real JWTs; confirm `has_table_privilege` and policy behavior.
5. Confirm Prisma server-side operations still enforce tenant ownership.
6. Require schema-drift check before production.

Migration has NOT been executed in this GitHub PR.
