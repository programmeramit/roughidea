import { NextResponse } from 'next/server';
import { createClient } from './utils/supabase/server';

export async function middleware(req: Request) {
  const res = NextResponse.next();
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    res.cookies.set('sb-access-token', session.access_token);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard', '/profile', '/projects'],
};
