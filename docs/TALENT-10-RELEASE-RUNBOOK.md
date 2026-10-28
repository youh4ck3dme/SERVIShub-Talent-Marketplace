# TALENT-10 — Release gates & deployment runbook

## Current status: NO-GO until verified
The complete Talent Marketplace migration is proposed in [PR #1](https://github.com/youh4ck3dme/SERVIShub-Talent-Marketplace/pull/1) against a clean `main`. On 18 October 2026, CI (Postgres migrations, RLS, unit, lint, typecheck, build), production dependency audit and CodeQL passed in this new owner repository. Production remains NO-GO until hosted Supabase JWT/tenant E2E, backup/recovery and UAT are verified.

### CI checks
- Frozen pnpm install; Prisma generate/validate and migrate deploy in disposable PostgreSQL 16.
- Simulated Supabase roles + all Supabase RLS SQL + negative database privilege tests.
- Node 22 TS strip-type unit tests for salary validation and CMS sanitization.
- Typecheck, lint, Next build.
- Dependency audit and CodeQL.
- Still required: real Supabase staging authenticated JWT / isolation integration tests and Playwright E2E tests; CI simulated roles are not equivalent to hosted Supabase. Do not deploy without these.

### Github protection and Vercel
1. In Settings > Branch protection/Rulesets protect main: require PR reviews and successful CI/CodeQL; prevent force-push.
2. Configure GitHub Environments **staging** and **production**. Production requires human approval. Scope secrets separately: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID.
3. Connect *this* repository to Vercel only after all drafts verified; set runtime Supabase URL/keys, DATABASE_URL, DIRECT_URL and secrets in Vercel environment.
4. Never use public VITE_ or NEXT_PUBLIC_ prefixes for Stripe/server/DB secrets.
5. Apply Prisma migrations via approved DIRECT_URL in staging, apply Supabase SQL policies, take backups/snapshot, verify RLS.
6. Perform one full employer-create → admin-approve → job-publish → candidate-apply E2E with two distinct accounts.
7. Configure WPGraphQL editorial CMS if needed, Resend sender and cron AFTER security tests.
8. Manual workflow_dispatch deploy is deliberately restricted to main with GitHub environment approvals. It does **not** run automatically, and its commands have not been verified in a real Vercel project.
9. Observe live health signals and roll back frontend via Vercel if needed; DB migrations are forward-only and require a separate tested recovery plan.
10. If any P0 or CI gate fails, NO-GO.

TODO: pin GitHub Actions to reviewed immutable SHAs and pin verified Vercel CLI; production deployment workflow is provided as an integration candidate, not certified automation.
