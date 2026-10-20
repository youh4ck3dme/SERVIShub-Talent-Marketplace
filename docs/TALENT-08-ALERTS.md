# TALENT-08 — Job alerts rollout

1. Apply Prisma migration for processing_until in **staging** after TALENT-03.
2. Configure server-only CRON_SECRET (min 32 chars), ALERT_UNSUBSCRIBE_SECRET (min 32 chars), RESEND_API_KEY, RESEND_FROM (verified sender), and HTTPS NEXT_PUBLIC_APP_URL.
3. Configure daily request GET /api/cron/job-alerts with Authorization: Bearer CRON_SECRET in deployment scheduler. Cron invocation does not happen automatically from this code.
4. Verify alert CRUD as CUSTOMER; other users cannot deactivate it by ID.
5. Verify cron requests with missing/wrong bearer return 401. Missing mail settings return 503.
6. Test matched jobs and email deliverability using staging recipients only. Verify signed unsubscribe confirmation POST.
7. Concurrent cron invocations are guarded with 10-minute processing lease; provider idempotency-key mitigates replays. Exactly-once delivery is **not guaranteed** if mail accepted but DB update fails. For stronger guarantees, introduce an outbox/delivery ledger.

Never put secrets in NEXT_PUBLIC_ or frontend. Do not treat this PR as proof that emails were delivered.
