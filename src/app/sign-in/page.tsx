'use client';

import * as React from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import { mapAuthError } from '@/lib/errors/auth';

const formSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Informe sua senha')
});

type FormValues = z.infer<typeof formSchema>;

const SignInPage = () => {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' }
  });

  async function onSubmit(values: FormValues) {
    try {
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
        fetchOptions: {
          onSuccess: () => router.push('/courses'),
          onError: (error) => {
            console.log(error);

            toast.error(mapAuthError(error));
          }
        }
      });
    } catch {
      toast.error('Falha no login');
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid gap-4">
                  <Image
                    src="/assets/imgs/ifma-avalia-logo.png"
                    alt="Logo IFMA"
                    width={100}
                    height={100}
                    className="mx-auto"
                  />
                  <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Entrar</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                      Acesse sua conta com seu email e senha.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="email@ifma.edu.br"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="password">Senha</FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            autoComplete="current-password"
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <Link href="/forgot-password" className="text-sm underline">
                      Esqueci minha senha
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-500 cursor-pointer hover:bg-green-600"
                  >
                    Entrar
                  </Button>
                </div>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{' '}
              <Link href="/sign-up" className="underline">
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted hidden items-center justify-center md:flex">
        <Image
          src="/assets/imgs/ifma-cx-logo.png"
          alt="Logo IFMA Caxias"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default SignInPage;
