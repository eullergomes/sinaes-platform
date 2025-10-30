'use server';

import prisma from '@/utils/prisma';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

async function getAuthenticatedUserIdFromCookies(): Promise<string | null> {
  const cookieHeader = (await headers()).get('cookie') ?? '';

  try {
    const session = await auth.api.getSession({
      headers: { cookie: cookieHeader }
    });
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

export type UpdateProfileInput = {
  name: string;
  image?: string | null;
};

export type UpdateProfileResult =
  | {
      ok: true;
      user: { id: string; name: string; email: string; image: string | null };
    }
  | { ok: false; error: string };

export async function updateProfileAction(
  input: UpdateProfileInput
): Promise<UpdateProfileResult> {
  try {
    const userId = await getAuthenticatedUserIdFromCookies();

    if (!userId) return { ok: false, error: 'Não autenticado' };

    const name = typeof input.name === 'string' ? input.name.trim() : '';
    if (name.length < 3 || name.length > 150) {
      return { ok: false, error: 'Nome inválido' };
    }

    const data: { name: string; image?: string | null } = { name };
    if (input.image !== undefined) {
      if (input.image !== null && typeof input.image !== 'string') {
        return { ok: false, error: 'Imagem inválida' };
      }
      data.image = input.image || null;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, image: true }
    });

    return { ok: true, user: { ...updated, image: updated.image ?? null } };
  } catch (e) {
    console.error('updateProfileAction error', e);
    return { ok: false, error: 'Erro interno' };
  }
}
