"use client";

import useUserWithRefresh from "@/hooks/useUserWithRefresh";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { pb } from "../pocketbase/db";
import Signin from "@/components/auth/signin";
import Signup from "@/components/auth/signup";

interface LoginProviderProps {
  children: React.ReactNode;
}

// 로그인 안 되어 있으면 로그인페이지로 이동
const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const { user, refreshUser } = useUserWithRefresh();
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();
  const pathname = usePathname();

  console.log(token);
  console.log(user);

  const verificationAndRefresh = async (token: string | null) => {
    try {
      await pb.collection("users").confirmVerification(token as string);
      refreshUser();
    } catch {}
  };

  // 토큰이 있다면
  if (token) {
    verificationAndRefresh(token);
  }

  // 처음에 접속시 user 가 없다면 /signin 으로 이동.
  if (
    !user &&
    !(
      pathname === "/auth/signin" ||
      pathname === "/auth/signup" ||
      pathname === "/auth/welcome" ||
      pathname === "/auth/confirm"
    )
  ) {
    router.push("/auth/signin");
  }

  if (!user && pathname === "/auth/signin") return <Signin />;
  if (!user && pathname === "/auth/signup") return <Signup />;
  if (!user && pathname === "/auth/welcome")
    return <>환영합니다. 로그인 해 주세요.</>;
  if (!user && pathname === "/auth/confirm")
    return <>메일을 확인 해 주세요~~</>;

  if (token && user) router.push("/");

  return <>{children}</>;
};

export default LoginProvider;
