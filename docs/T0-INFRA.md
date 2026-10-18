# T0 — Infra stav a blokéry

> Stav k 2026-08-08. Code-only časť T0 je hotová; zvyšok vyžaduje credentials / manuálne kroky v dashboardoch.

## Hotové v kóde

| Položka | Stav | Poznámka |
|---------|------|----------|
| GitHub Actions CI | ✅ | lint → typecheck → build + `prisma validate` (`.github/workflows/ci.yml`) |
| Security headers | ✅ | `next.config.ts` (HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy) |
| Sentry wiring | ✅ stub | `instrumentation.ts` — aktivuje sa až s `SENTRY_DSN`; bez DSN no-op |
| Auth session helpers | ✅ | `src/lib/auth/session.ts`, role gates `/pro`, `/admin` |
| Prisma schema + RLS | ✅ | migrácie pripravené v `prisma/migrations/` + `supabase/migrations/` |

## Blokované — vyžaduje akciu používateľa

### 1. Supabase cloud projekt (blokér pre Auth E2E + migrate deploy)

Org `hskllwoulrjalhblhyfm` má **2 aktívne free projekty** (`bizagent-app-2026`, `gold` — obe `ACTIVE_HEALTHY`) → free limit 2 projekty je naplnený, CLI create zlyháva s `maximum limits for the number of active free projects`. Repo zatiaľ **nie je linknuté** (`supabase link` nebolo spustené, žiadny `servishub-sk` projekt neexistuje).

**Akcie:**
1. Pause/delete jeden z neaktívnych projektov **alebo** upgrade plánu
2. Dashboard → New project `servishub-sk`, region `eu-central-1`
3. API keys → `.env.local` (podľa `.env.example`)
4. `supabase link --project-ref <ref>`
5. `pnpm db:migrate` + apply RLS: `supabase db push` (alebo SQL cez dashboard)

### 2. Vercel link (blokér pre preview deploys)

- `vercel link` + import repa (najprv treba GitHub remote — repo je zatiaľ len lokálny git)
- Env vars do Vercel projektu: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL`, `DIRECT_URL`
- Odporúčaný region: `fra1` (EU, blízko k Supabase `eu-central-1`)

### 3. Sentry DSN

1. Vytvoriť Sentry projekt (Next.js)
2. `pnpm add @sentry/nextjs`
3. `SENTRY_DSN` do `.env.local` + Vercel env — `instrumentation.ts` sa aktivuje automaticky
4. Pre source maps: `SENTRY_AUTH_TOKEN` + wrap `nextConfig` cez `withSentryConfig` (po inštalácii balíka)

### 4. Git remote

Repo nemá žiadny remote — commity sú len lokálne. Pre CI/preview workflow vytvoriť GitHub repo a pushnúť `main`.

### 5. Stripe účet (T3, nie T0)

Založiť Stripe (SK business), aktivovať Connect Express, test keys → `.env.local`.

## Overenie po odblokovaní (DoD T0)

- [ ] `pnpm db:migrate` proti cloud DB prejde
- [ ] Login/signup E2E < 5 s (`/login` → profil sa vytvorí cez `ensureProfileAfterSignup`)
- [ ] Každý PR má Vercel preview + green CI
- [ ] Sentry zobrazuje test event z produkčného deployu
