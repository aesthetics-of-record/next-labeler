"use client";

import { SignInFormSchema } from "@/lib/types/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { ClipLoader } from "react-spinners";
import { useToast } from "@/components/ui/use-toast";
// import { BackgroundBeams } from "@/components/ui/background-beams";
// import ButtonShimmer from "../custom/button-shimmer";
import { useAtom } from "jotai";
import { pb } from "@/lib/pocketbase/db";
import useUserWithRefresh from "@/hooks/useUserWithRefresh";
import { Button } from "@/components/ui/button";

const Signin = () => {
  const { refreshUser } = useUserWithRefresh();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof SignInFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit: SubmitHandler<z.infer<typeof SignInFormSchema>> = async (
    formData
  ) => {
    try {
      await pb
        .collection("users")
        .authWithPassword(formData.email, formData.password);
    } catch {
      toast({
        title: "로그인 에러",
        description: "로그인 정보가 유효하지 않습니다.",
      });
      return;
    }

    if (!pb.authStore.model!.verified) {
      toast({
        title: "로그인 에러",
        description: "먼저 이메일 인증을 해 주세요.",
      });
      return;
    }

    refreshUser();
  };

  return (
    <Form {...form}>
      <div className="h-screen w-full rounded-md bg-background relative flex flex-col items-center justify-center antialiased">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="relative z-10 text-7xl text-gradient text-center font-sans font-bold">
            LABELER-X
          </h1>
          <div className="h-8" />

          <form
            className="relative z-10"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="이메일" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <div className="h-4" />

            <FormField
              disabled={isLoading}
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="비밀번호" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <div className="h-4" />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {!isLoading ? (
                "로그인"
              ) : (
                <ClipLoader color="hsla(168, 67%, 53%, 1)" size={20} />
              )}
            </Button>
            <div className="h-4" />

            <span className="flex text-sm">
              <span className="mr-2 text-slate-400">처음 방문하셨나요 ?</span>
              <span
                className="text-gradient hover:underline underline-offset-4 cursor-pointer font-black"
                onClick={() => {
                  // setLoginComponent("signup");
                }}
              >
                회원가입 하러가기
              </span>
            </span>
            {/* <ButtonShimmer
              type="button"
              onClick={async () => {
                const a = await pb
                  .collection("users")
                  .requestVerification("aaaapple123@naver.com");

                console.log(a);
              }}
            >
              버튼
            </ButtonShimmer> */}
          </form>
        </div>
        {/* <BackgroundBeams /> */}
      </div>
    </Form>
  );
};

export default Signin;
