// import { TypedPocketBase } from "@/types/pocketbase-types";
import PocketBase from "pocketbase";

let singletonClient: any | null = null;

// 클라이언트 컴포넌트에서 사용가능
export function createBrowserClient() {
  if (!process.env.NEXT_PUBLIC_POCKETBASE_API_URL) {
    throw new Error("Pocketbase API url not defined !");
  }

  const createNewClient = () => {
    return new PocketBase(
      process.env.NEXT_PUBLIC_POCKETBASE_API_URL
    )
  };

  const _singletonClient = singletonClient ?? createNewClient();

  if (typeof window === "undefined") return _singletonClient;

  if (!singletonClient) singletonClient = _singletonClient;

  singletonClient.authStore.onChange(() => {
    document.cookie = singletonClient!.authStore.exportToCookie({
      httpOnly: false,
    });
  });

  // globally disable auto cancellation
  singletonClient.autoCancellation(false);

  return singletonClient;
}