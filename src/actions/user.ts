'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/utils/prisma';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export type ActionResponse = { success: boolean; error?: string };

// Server Action: promove um usuário a DIRECTOR (apenas ADMIN)
export async function promoteToDirector(
  userId: string
): Promise<ActionResponse> {
  // Recupera sessão via cookies na Server Action
  const cookieHeader = (await headers()).get('cookie') ?? '';
  const session = await auth.api.getSession({
    headers: { cookie: cookieHeader }
  });

  if (!session?.user) {
    return { success: false, error: 'Não autenticado.' };
  }
  const role = session.user.role;
  if (role !== 'ADMIN' && role !== UserRole.ADMIN) {
    return { success: false, error: 'Acesso negado.' };
  }
  if (session.user.id === userId) {
    return {
      success: false,
      error: 'Você não pode alterar sua própria permissão.'
    };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.DIRECTOR }
    });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Falha ao atualizar permissão:', error);
    return { success: false, error: 'Erro inesperado no banco de dados.' };
  }
}

// Server Action: Atualiza o papel de um usuário para DIRECTOR ou VISITOR (apenas ADMIN)
export async function updateUserRole(
  userId: string,
  roleTo: 'DIRECTOR' | 'VISITOR'
): Promise<ActionResponse> {
  const cookieHeader = (await headers()).get('cookie') ?? '';
  const session = await auth.api.getSession({
    headers: { cookie: cookieHeader }
  });

  if (!session?.user) {
    return { success: false, error: 'Não autenticado.' };
  }
  const requesterRole = session.user.role;
  if (requesterRole !== 'ADMIN' && requesterRole !== UserRole.ADMIN) {
    return { success: false, error: 'Acesso negado.' };
  }
  if (session.user.id === userId) {
    return {
      success: false,
      error: 'Você não pode alterar sua própria permissão.'
    };
  }

  try {
    const newRole =
      roleTo === 'DIRECTOR' ? UserRole.DIRECTOR : UserRole.VISITOR;
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Falha ao atualizar permissão:', error);
    return { success: false, error: 'Erro inesperado no banco de dados.' };
  }
}
