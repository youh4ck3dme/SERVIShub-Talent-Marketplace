# ServisHub SK — Produktový & engineering backlog

> Zdroj pravdy pre post-scaffold prácu. Sync s plánom `servishub_sk_scaffold`.  
> Scaffold (Fáza 0) = hotový v `~/HUB/01-Projekty/ServisHUB-SK`.

## Stav scaffoldu

| Položka | Stav |
|---------|------|
| Repo root `ServisHUB-SK` | Done |
| Next.js App Router + Turbopack | Done (Next 16) |
| Supabase init + Auth SSR + middleware | Done (cloud create blokovaný free limitom) |
| Prisma v7 + init migrácia + RLS draft | Partial (apply proti DB TODO) |
| README + CLAUDE.md + `.env.example` | Done |
| `.github/` CI | Done |
| Security headers + Sentry stub | Done (Sentry čaká na DSN — pozri [T0-INFRA](T0-INFRA.md)) |

---

## Stack (kanonický)

Next.js App Router · Vercel · Supabase (Postgres + RLS + Auth) · Prisma v7 · Stripe Connect Express · GoPay (SK fallback) · SuperFaktura · Google Calendar · Google Maps · Resend / Twilio / FCM · Sentry + Vercel Analytics

---

## Dátový model — gap vs. scaffold

**Už v schéme:** Profile, Provider, Category, Service, ServiceArea, Availability, Booking, Review, Subscription, Lead

**Doplniť:**

| Tabuľka | Kľúčové polia |
|---------|----------------|
| `payments` | `intent_id`, `capture_method`, `application_fee`, `status`, webhook raw |
| `payouts` | `provider_id`, `amount`, `stripe_transfer_id`, `cadence`, `status` |
| `disputes` | `booking_id`, `status`, `evidence`, `resolution`, `opened_by` |
| `messages` | `thread`, `sender_id`, `body`, `read_at`, optional `booking_id` |
| `notifications` | `user_id`, `channel`, `template`, `status`, `sent_at` |
| `bookings` (extend) | `deposit_amount`, `captured_at`, `stripe_payment_intent_id` |
| `providers` (extend) | `lat`/`lng` alebo PostGIS point, KYC refs |
| `leads` (extend) | `credit_cost`, `unlocked_by`, `expires_at` |

**Indexy:** city/PSČ, category+price, `bookings(provider_id, scheduled_at)`, UNIQUE `payments(intent_id)`, geo (GiST) neskôr.

**RLS:** customer = own rows; provider = own catalog + party bookings; admin = all; anon = public catalog/reviews. Prisma = trusted server (authorize in app).

---

## MVP sprinty (4–6 týždňov)

### T0 — Infra + Auth + CI
Supabase link, Auth E2E, Vercel preview, GitHub Actions, Sentry.  
**Metrika:** green CI; login < 5 s; preview na každom PR.

### T1 — Profily + služby + search
Provider onboarding (bez full KYC), CRUD services, search (mesto, kategória, cena, rating).  
**Metrika:** ≥ 10 seed providerov; search P95 < 400 ms.

**Stav (2026-08-09):** kód hotový, čaká na live DB (Supabase link — pozri [T0-INFRA](T0-INFRA.md)).

- [x] `/pro/profil` — onboarding forma (businessName, bio, IČO/DIČ, mesto, PSČ, kategórie), zod validácia, server action, guard PROVIDER/ADMIN
- [x] `/pro/sluzby` — CRUD služieb (list + create `/nova` + edit `/[id]`, soft-delete cez `isActive`), server actions
- [x] `/hladat` — reálny search cez Prisma (q, mesto, kategória, cena, min. rating, sort rating/cena, stránkovanie 12/str., GET forma pre SEO/share)
- [x] `/p/[slug]` — verejný profil (generateMetadata, JSON-LD LocalBusiness, služby, recenzie placeholder, 404 pri neznámom slug)
- [x] Data layer `src/lib/data/*` + zod schémy `src/lib/validation/*`; graceful empty states bez DATABASE_URL
- [x] Schema: Provider↔Category M:N (`_CategoryToProvider`) + migrácia `20260809013500` + RLS
- [ ] Overiť proti live DB: migrácie apply, seed kategórií + ≥ 10 providerov, search P95 < 400 ms
- [ ] KYC (Veriff/Onfido) — mimo T1 scope

### T2 — Rezervácie + kalendár
Slots (reuse mistral patterns), booking create/cancel, conflict guards, Resend confirm.  
**Metrika:** 0 double-bookings v e2e; happy-path success ≥ 95 %.

### T3 — Stripe Connect + admin
Express onboarding, charge + `application_fee_amount`, webhooks, admin overview.  
**Metrika:** test charge + fee; webhook reconcile 100 % (test mode).

### T4 — Recenzie + waitlist + landing
Reviews po COMPLETED, SEO landing + structured data, waitlist.  
**Metrika:** CWV green; waitlist funguje; 1× review e2e.

### Buffer T5–T6
Bugfix, UX, BA soft-launch prep (upratovanie · Bratislava).

---

## Monetizácia (fázy)

| Fáza | Scope |
|------|--------|
| MVP T3 | Connect Express, immediate capture, application fee 10–20 % |
| Fáza 2 | Manual capture escrow; Stripe Billing tiers; lead kredity |
| Fáza 2+ | GoPay fallback; SuperFaktura auto-faktúry (DPH na províziu) |

---

## Bezpečnosť / GDPR / právne

- RLS všade; service-role len server
- KYC cez Veriff/Onfido — **neskladovať ID scany** v app DB
- Retention + audit log (admin, payouts, disputes)
- Consent UI; zmluvy sprostredkovania; anti-leak (poistenie len cez platformu, penalty)

---

## DevOps / testovanie

- Feature-branch → PR → Vercel preview
- CI: lint / typecheck / build (+ Playwright/Vitest neskôr)
- Sentry, Vercel Analytics, uptime; k6 pred soft launch
- Prisma migrate + `supabase/migrations` RLS; PITR keď Pro
- Terraform IaC = post-MVP

---

## UX rozhodnutia

- Dual onboarding (zákazník rýchly / profík wizard)
- Verifikácia PENDING → VERIFIED/REJECTED
- Booking: service → slot → extras → deposit → confirm; collision = najbližšie sloty
- Notifikácie: email P0, SMS reminders, push neskôr
- MVP locale `sk`; i18n sk/en vo Fáze 2; a11y baseline od T0

---

## Škálovanie (post-MVP)

Lead marketplace (pay-per-lead) · prioritné zobrazenie podľa tieru · dispute workflow · payout cadence · fraud rate-limits / anomaly scoring

---

## Go-to-market

**Upratovanie · Bratislava** → supply cez agentúry + referral + early-bird PRO → demand SEO + waitlist → partner poistenie

---

## Komponentový katalóg

| Komponent | Priorita |
|-----------|----------|
| Landing + Waitlist (SEO, JSON-LD) | P0 |
| Auth (email / OTP / OAuth) | P0 |
| Provider onboarding wizard | P0 (KYC P1) |
| Search & map | P0 (mapa P1) |
| Service detail + booking modal | P0 |
| Booking flow + PaymentIntent | P0 |
| Provider dashboard | P0 |
| Admin dashboard | P0 (disputes P1) |
| Payments service + webhooks | P0 |
| SuperFaktura worker | P1 |
| Notifications (Resend/Twilio/FCM) | P0/P1 |
| Background jobs (capture/refund) | P1 |
| Google Calendar / Maps | P1 |
| Monitoring (Sentry…) | P0 |
| Feature flags | P1 |
| Rate limiter / fraud middleware | P1 |
| I18n sk/en + a11y utils | P1 |

### Reuse (mistral-booking-whitelabel)

- `apps/web/src/lib/booking/calendar.utils.ts`
- `TimeSlotPicker.tsx`, `Calendar.tsx`
- `supabase/migrations/009_booking_concurrency_hardening.sql`

---

## Execution order (ďalej)

Aktuálny batch: **[docs/NEXT-5.md](NEXT-5.md)** (schema gap · RLS · CI · auth helpers).

1. ~~Rozšíriť Prisma o Payment / Payout / Dispute / Message / Notification + geo polia~~ (v NEXT-5)
2. ~~`.github/workflows/ci.yml`~~ (v NEXT-5)
3. T0 infra zvyšok: Supabase link, Vercel, Sentry DSN — stav a blokéry v [T0-INFRA.md](T0-INFRA.md); Auth E2E UI po Supabase link
4. Sprinty T1 → T4 podľa metrík vyššie
