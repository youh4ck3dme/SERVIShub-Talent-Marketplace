# TALENT-02 — Supabase Auth

## Configuration
Server/Preview: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, DATABASE_URL.
Configure Supabase Dashboard > Authentication > URL Configuration:
- https://<staging-domain>/auth/callback
- https://<production-domain>/auth/callback

Email confirmations must return to /auth/callback with PKCE code or token_hash+type (email/signup).
Supabase Auth, not the Prisma app database, owns password hashes.
Customer/candidate vs provider/employer are the only self-registerable roles.
ADMIN is never granted based on user-editable metadata.
Profile upsert only updates email/name on subsequent sign-in (not role).

## Required staging acceptance
1. Candidate signup -> confirmation -> login -> profile row -> logout.
2. Employer signup -> PROVIDER, access /pro, denied /admin.
3. Invalid credentials, expired link, unauthorized requests -> error/redirect.
4. Existing user sign-in without profile -> idempotent sync via /api/auth/sync-profile.
5. Missing DATABASE_URL -> sync responds 503, no privileged fallback.
6. Verify Next.js 16 SSR cookie persistence through callback and refresh.
7. Verify rate limiting and bot abuse protection at Supabase Auth/dashboard level.

No live credentials, OAuth providers or production migration are configured in this PR.
