import { NextResponse } from 'next/server';
import { getSessionUser, ensureProfileAfterSignup } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  const user = await getSessionUser();
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const profile = await ensureProfileAfterSignup({
      userId: user.id, email: user.email,
      fullName: typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name.slice(0, 120) : null,
      role: user.user_metadata?.account_type === 'employer' ? 'PROVIDER' : 'CUSTOMER',
    });
    return NextResponse.json({ profileId: profile.id, role: profile.role });
  } catch (error) {
    console.error('[api/auth/sync-profile] failed', error);
    return NextResponse.json({ error: 'Profile provisioning unavailable' }, { status: 503 });
  }
}
