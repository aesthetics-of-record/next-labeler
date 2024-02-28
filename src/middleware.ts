import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@/lib/pocketbase/create-server-client";

// For protected pages
// If auth is not valid for matching routes
// Redirect to a redirect path
export function middleware(request: NextRequest) {
  const redirect_path = "http://localhost:3000/login";

  const cookieStore = cookies();

  const { authStore } = createServerClient(cookieStore);

  // 로그인되어 있지 않고, "/signup" 경로로 요청이 오면 허용
  if (!authStore.isValid && request.nextUrl.pathname === "/signup") {
    return null; // 다음 미들웨어로 계속 진행
  }

  // 토큰이 유호하지 않거나 이메일 인증이 되지 않았다면,
  if (!authStore.isValid || !authStore.model?.verified ) {
    // 로그인 페이지로 리다이렉트
    return NextResponse.redirect(redirect_path);
  }

  
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login route)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|signup|^$).*)",
  ],
};