# SERVIShub → Talent & Freelance Marketplace

Next-generation SK/CZ tech job board + freelance marketplace, built incrementally from SERVIShub. **Work in progress, not production-ready.**

## Architecture
- Next.js 16 / React 19 / TypeScript / Tailwind 4 frontend + Server Actions
- Supabase Auth for identities and sessions; PostgreSQL + Prisma 7 for transactional domain
- Provider/Service/Booking legacy paths remain, new Candidate/Company/Job/Application/JobAlert domain is additive
- WordPress WPGraphQL is read-only **editorial CMS** for /blog (separate deployment, optional)
- Resend scheduled job alert cron once configured; no secrets in browser

## Local setup
```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
# configure real staging Supabase/DB credentials
pnpm exec prisma validate
pnpm exec prisma generate
pnpm dev
```

Do not run `prisma migrate dev` against production. Apply new migrations on disposable/staging DB first and review RLS/privilege SQL separately. Start at `docs/TALENT-10-RELEASE-RUNBOOK.md`.

## Core routes
| URL | Purpose |
| --- | --- |
| / | Landing page |
| /praca | Public job catalog, salary and remote filters |
| /praca/[slug] | Public job detail + JobPosting SEO |
| /login, /signup, /auth/callback | Supabase Auth |
| /firma/onboarding, /firma/dashboard | Employer onboarding and workspace |
| /firma/ponuky/nova | Create and publish jobs |
| /admin/firmy | Admin verification of companies |
| /kandidat/profil, /kandidat/ziadosti | Candidate profile / applications |
| /kandidat/strazeny-pes | Saved search email alerts |
| /blog, /blog/[slug] | Optional WordPress editorial content |
| /hladat, /pro | Original service marketplace routes preserved |

## Release quality
`pnpm test:unit`, `pnpm lint`, `pnpm typecheck`, `pnpm build`.
GitHub Actions checks additionally run ephemeral Postgres migrations/RLS tests, audit and CodeQL.
**No success claim until these run green**, hosted Supabase/JWT E2E and manual UAT pass.
See issues #1–#10 and stacked draft PRs #11–#20.

Design inspired by good marketplace UX, not copied proprietary Pretlak source code, logos or assets.
