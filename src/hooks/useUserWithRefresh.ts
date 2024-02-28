import { useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/jotai/store";
import { pb } from "@/lib/pocketbase/db";

const useUserWithRefresh = () => {
  const [user, setUser] = useAtom(userAtom);

  const refreshUser = async () => {
    try {
      const authData = await pb.collection("users").authRefresh();

      if (!pb.authStore.model!.verified) {
        // 이메일 인증이 안 되어 있다면
        return;
      }

      if (authData) setUser(authData);
    } catch {
      // 토큰 refresh 중 에러 발생 시
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return { user, refreshUser };
};

export default useUserWithRefresh;
