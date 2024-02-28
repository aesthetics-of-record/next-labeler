import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/pocketbase/create-server-client';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') as string;

  const cookieStore = cookies();

  const pb = createServerClient(cookieStore);

  try {
    // 이메일 인증하기
    await pb.collection('users').confirmVerification(token);
    return NextResponse.redirect('/login');
  } catch {
    return NextResponse.json('이메일 인증 중 에러 발생');
  }
}
