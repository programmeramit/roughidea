import { NextResponse } from 'next/server';
import { createClient } from './utils/supabase/server';

export async function middleware(req:Request) {
  const res = NextResponse.next();
  const supabase = await  createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    res.cookies.set('sb-access-token', user.access_token);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard', '/profile'],
};
