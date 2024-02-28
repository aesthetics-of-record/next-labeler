'use client';

import { SignInFormSchema, SignUpFormSchema } from '@/lib/types/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import * as z from 'zod';
import { ClipLoader } from 'react-spinners';
import { useToast } from '@/components/ui/use-toast';
import { createBrowserClient } from '@/lib/pocketbase/create-browser-client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Signup = () => {
  const { toast } = useToast();
  const route = useRouter();
  const pb = createBrowserClient();

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const isLoading = form.formState.isSubmitting;

  async function signUpNewUser({
    email,
    password,
  }: z.infer<typeof SignInFormSchema>) {
    await pb.collection('users').create({
      email: email,
      password: password,
      passwordConfirm: password,
      name: 'John Doe',
    });
  }

  const onSubmit = async ({
    email,
    password,
  }: z.infer<typeof SignInFormSchema>) => {
    try {
      await signUpNewUser({ email, password });
      await pb.collection('users').requestVerification(email); // 인증 메일 보내기

      route.push('/');
      toast({
        title: '회원가입이 완료되었습니다.',
        description: '이메일 인증 후 로그인 해 주세요.',
      });
    } catch {
      toast({
        title: '회원가입 중 오류 발생',
        description:
          '회원 가입 중 문제가 발생하였거나, 이미 회원가입 된 계정입니다.',
      });
    }
  };

  return (
    <>
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
                      <Input
                        type="email"
                        placeholder="이메일"
                        {...field}
                      />
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
                      <Input
                        type="password"
                        placeholder="비밀번호"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <div className="h-4" />

              <FormField
                disabled={isLoading}
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호 확인"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="h-4" />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {!isLoading ? (
                  '회원가입'
                ) : (
                  <ClipLoader
                    color="hsla(168, 67%, 53%, 1)"
                    size={20}
                  />
                )}
              </Button>
              <div className="h-4" />

              <span className="flex text-sm">
                <span className="mr-2 text-slate-400">
                  이미 가입하셨나요 ?
                </span>
                <span
                  className="text-gradient hover:underline underline-offset-4 cursor-pointer font-black"
                  onClick={() => {
                    route.push('/signin');
                  }}
                >
                  로그인 하러가기
                </span>
              </span>
            </form>
          </div>
        </div>
      </Form>
    </>
  );
};

export default Signup;
