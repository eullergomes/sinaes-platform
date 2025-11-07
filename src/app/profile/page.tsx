'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useSession } from '@/lib/auth-client';
import { uploadToCloudinary } from '@/services/uploadToCloudinary';
import { updateProfileAction } from '@/actions/profile';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session === null) {
      router.replace('/sign-in');
    }
  }, [session, router]);

  const user = session?.user;
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.image ?? null
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    name: z
      .string()
      .trim()
      .min(3, 'Nome deve ter pelo menos 3 caracteres.')
      .max(150, 'Nome deve ter no máximo 150 caracteres.'),
    email: z.string().email().optional(),
    avatar: z.any().optional()
  });

  type ProfileForm = z.infer<typeof formSchema>;

  const form = useForm<ProfileForm>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      avatar: undefined
    }
  });

  useEffect(() => {
    form.reset({
      name: user?.name ?? '',
      email: user?.email ?? '',
      avatar: undefined
    });
    setAvatarPreview(user?.image ?? null);
  }, [user?.name, user?.email, user?.image, form]);

  const canSubmit = useMemo(() => {
    return !isSubmitting && form.formState.isValid;
  }, [isSubmitting, form.formState.isValid]);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meu perfil</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            setIsSubmitting(true);
            let imageUrl: string | undefined = undefined;

            try {
              if (avatarFile) {
                const res = await uploadToCloudinary(
                  avatarFile,
                  'ifma-avatars'
                );
                imageUrl = res.secure_url;
              }

              const result = await updateProfileAction({
                name: values.name.trim(),
                image: imageUrl
              });
              if (!result.ok) {
                throw new Error(result.error || 'Erro ao atualizar o perfil');
              }
              toast.success('Perfil atualizado');
              router.refresh();
            } catch (err) {
              const msg =
                err instanceof Error
                  ? err.message
                  : 'Erro ao atualizar o perfil';
              toast.error(msg);
            } finally {
              setIsSubmitting(false);
            }
          })}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label>Foto</Label>
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
                                width={80}
                                height={80}
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
                                if (!file) {
                                  field.onChange(undefined);
                                  if (avatarPreview)
                                    URL.revokeObjectURL(avatarPreview);
                                  setAvatarFile(null);
                                  setAvatarPreview(null);
                                  return;
                                }
                                if (!file.type.startsWith('image/')) {
                                  toast.error('Selecione uma imagem válida.');
                                  field.onChange(undefined);
                                  return;
                                }
                                if (file.size > 2 * 1024 * 1024) {
                                  toast.error(
                                    'A imagem deve ter no máximo 2MB.'
                                  );
                                  field.onChange(undefined);
                                  return;
                                }
                                field.onChange(file);
                                if (avatarPreview)
                                  URL.revokeObjectURL(avatarPreview);
                                setAvatarFile(file);
                                setAvatarPreview(URL.createObjectURL(file));
                              }}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormControl>
                          <Input id="email" {...field} readOnly disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormControl>
                          <Input
                            id="name"
                            placeholder="Seu nome"
                            maxLength={150}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="cursor-pointer bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
