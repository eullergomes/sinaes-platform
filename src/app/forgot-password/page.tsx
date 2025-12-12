'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { CircleCheckBig } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Email inválido')
});

type FormValues = z.infer<typeof formSchema>;

const ForgotPasswordPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const [lastEmail, setLastEmail] = useState<string | null>(null);

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' }
  });

  async function onSubmit(values: FormValues) {
    try {
      setSubmitting(true);

      const { error } = await authClient.requestPasswordReset({
        email: values.email,
        // URL da página que vai receber o token && mostrar o formulário de nova senha
        redirectTo: `${window.location.origin}/reset-password`
      });

      // (mesmo se o email não existir no sistema) :contentReference[oaicite:2]{index=2}
      if (error) {
        console.error(error);
      }

      toast.success('Redefinição de senha enviada! Verifique seu email.');
      setSubmitted(true);
      setLastEmail(values.email);
      setCooldown(60);
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível enviar o link de recuperação.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="">
            {submitted ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-6 text-center">
                  <CircleCheckBig className="h-24 w-24 text-green-500" />
                  <h1 className="text-3xl font-bold">Verifique seu email</h1>
                  <div className="flex flex-col gap-2">
                    <p className="text-muted-foreground text-base text-balance">
                      Enviamos um link de redefinição de senha para o email
                      informado.
                    </p>
                    <p className="text-muted-foreground text-base text-balance">
                      Se não encontrar, verifique a caixa de spam ou lixo
                      eletrônico.
                    </p>
                    <p className="text-muted-foreground text-base text-balance">
                      Caso não tenha recebido, aguarde alguns minutos e tente
                      novamente.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    Não recebeu o e-mail?
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-muted-foreground h-auto rounded-none border-none p-0 text-xs underline shadow-none hover:bg-transparent hover:text-gray-800"
                    disabled={cooldown > 0 || submitting}
                    onClick={async () => {
                      if (!lastEmail) return;
                      try {
                        setSubmitting(true);
                        const { error } = await authClient.requestPasswordReset(
                          {
                            email: lastEmail,
                            redirectTo: `${window.location.origin}/reset-password`
                          }
                        );
                        if (error) {
                          console.error(error);
                        }
                        toast.success(
                          'Reenvio solicitado! Verifique seu email.'
                        );
                        setCooldown(60);
                      } catch (err) {
                        console.error(err);
                        toast.error('Não foi possível reenviar o link.');
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  >
                    {cooldown > 0 ? `Reenviar (${cooldown}s)` : 'Reenviar'}
                  </Button>
                </div>
                <div className="text-center text-base">
                  <Link href="/sign-in" className="underline">
                    Voltar ao login
                  </Link>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="grid gap-4">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <h1 className="text-2xl font-bold">Recuperar senha</h1>
                      <p className="text-muted-foreground text-sm text-balance">
                        Digite seu email para receber um link de redefinição.
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

                    <Button
                      type="submit"
                      className="w-full cursor-pointer bg-green-500 hover:bg-green-600"
                      disabled={submitting}
                    >
                      {submitting
                        ? 'Enviando...'
                        : 'Enviar link de recuperação'}
                    </Button>

                    <div className="text-center text-sm">
                      Lembrou sua senha?{' '}
                      <Link href="/sign-in" className="underline">
                        Fazer login
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
      {/* imagem opcional */}
      {/* <div className="bg-muted hidden items-center justify-center md:flex">
			</div> */}
    </div>
  );
};

export default ForgotPasswordPage;
