// import { TypedPocketBase } from "@/types/pocketbase-types";
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import PocketBase from 'pocketbase';

// 서버 컴포넌트에서만 사용 가능. cookieStore 넣어서 사용해야 인증기능 활성화
export function createServerClient(cookieStore?: ReadonlyRequestCookies) {
  if (!process.env.NEXT_PUBLIC_POCKETBASE_API_URL) {
    throw new Error('Pocketbase API url not defined !');
  }

  if (typeof window !== 'undefined') {
    throw new Error(
      'This method is only supposed to call from the Server environment'
    );
  }

  const client = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_API_URL);

  if (cookieStore) {
    const authCookie = cookieStore.get('pb_auth');

    if (authCookie) {
      client.authStore.loadFromCookie(
        `${authCookie.name}=${authCookie.value}`
      );
    }
  }

  return client;
}
