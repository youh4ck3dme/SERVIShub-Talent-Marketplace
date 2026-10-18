import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureProfileAfterSignup } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  const supabase = await createClient();
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(new URL('/login?error=callback', url.origin));
  } else if (tokenHash && (type === 'email' || type === 'signup')) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) return NextResponse.redirect(new URL('/login?error=callback', url.origin));
  } else {
    return NextResponse.redirect(new URL('/login?error=callback', url.origin));
  }
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user?.email) return NextResponse.redirect(new URL('/login?error=session', url.origin));
  try {
    await ensureProfileAfterSignup({
      userId: user.id, email: user.email,
      fullName: typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name.slice(0, 120) : null,
      role: user.user_metadata?.account_type === 'employer' ? 'PROVIDER' : 'CUSTOMER',
    });
  } catch (cause) {
    console.error('[auth/callback] profile provisioning failed', cause);
    return NextResponse.redirect(new URL('/login?error=profile', url.origin));
  }
  return NextResponse.redirect(new URL(user.user_metadata?.account_type === 'employer' ? '/pro' : '/', url.origin));
}
