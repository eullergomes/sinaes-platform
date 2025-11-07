'use client';

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
import { PasswordInput } from '../../components/ui/password-input';
import { Loader2, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { mapAuthErrorCode } from '@/lib/errors/auth';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { uploadToCloudinary } from '@/services/uploadToCloudinary';

const SignUpForm = () => {
  const formSchema = z
    .object({
      name: z.string().trim().min(1, 'Nome é obrigatório'),
      email: z.email('Email inválido'),
      password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
      confirmPassword: z
        .string()
        .min(8, 'Senha deve ter pelo menos 8 caracteres'),
      avatar: z
        .instanceof(File)
        .or(z.any().refine((v) => v instanceof File, 'Arquivo inválido'))
        .optional()
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'As senhas não coincidem',
      path: ['confirmPassword']
    });

  type FormValues = z.infer<typeof formSchema>;

  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      avatar: undefined as unknown as File | undefined
    }
  });

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined;

      const file = values.avatar instanceof File ? values.avatar : undefined;
      if (file) {
        if (!file.type.startsWith('image/')) {
          throw new Error('Arquivo inválido');
        }
        if (file.size > 2 * 1024 * 1024) {
          throw new Error('Máx 2MB');
        }
        const uploadResponse = await uploadToCloudinary(file, 'ifma-avatars');
        imageUrl = uploadResponse.secure_url;
      }

      await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        image: imageUrl,
        fetchOptions: {
          onSuccess: () => {
            router.push('/courses');
          },
          onError: (error) => {
            console.log(error);
            const code = (error as { error?: { code?: string } })?.error?.code;
            const message = mapAuthErrorCode(code, 'Erro ao criar conta.');
            if (code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
              form.setError('email', { message });
            }
            toast.error(message);
          }
        }
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao criar conta.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
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
                    <h1 className="text-2xl font-bold">Cadastre-se</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                      Crie uma nova conta preenchendo o formulário abaixo.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <div className="flex flex-col items-center gap-4">
                          <label
                            htmlFor="avatar"
                            className="h-20 w-20 cursor-pointer overflow-hidden rounded-full border bg-gray-100"
                            title={
                              avatarPreview ? 'Alterar foto' : 'Enviar foto'
                            }
                          >
                            {avatarPreview ? (
                              <Image
                                src={avatarPreview}
                                alt="Pré-visualização do avatar"
                                className="h-full w-full object-cover"
                                width={24}
                                height={24}
                              />
                            ) : (
                              <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                                <UploadCloud className="h-6 w-6" />
                              </div>
                            )}
                          </label>
                          <FormControl>
                            <Input
                              id="avatar"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                field.onChange(file);
                                if (avatarPreview)
                                  URL.revokeObjectURL(avatarPreview);
                                setAvatarPreview(
                                  file ? URL.createObjectURL(file) : null
                                );
                              }}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="name">Nome completo</FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            placeholder="Informe seu nome completo"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="email@example.com"
                            type="email"
                            autoComplete="email"
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
                            placeholder="******"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="confirmPassword">
                          Confirme sua senha
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="confirmPassword"
                            placeholder="******"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-500 cursor-pointer hover:bg-green-600"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      'Criar'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{' '}
              <Link href="/sign-in" className="underline">
                Entrar
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

export default SignUpForm;
