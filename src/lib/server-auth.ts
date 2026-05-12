import { headers } from 'next/headers';
import type { Course, UserRole } from '@prisma/client';
import prisma from '@/utils/prisma';
import { auth } from '@/lib/auth';
import {
  canDeleteCourse,
  canEditIndicator,
  canUpdateCourse,
  isAdmin,
  isDirector
} from '@/lib/permissions';

type AuthUser = {
  id: string;
  role?: UserRole | string | null;
};

type AuthFailure = {
  ok: false;
  status: 401 | 403 | 404;
  error: string;
};

type AuthSuccess<T extends object = object> = {
  ok: true;
  user: AuthUser;
} & T;

export type AuthResult<T extends object = object> =
  | AuthSuccess<T>
  | AuthFailure;

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieHeader = (await headers()).get('cookie') ?? '';
  const session = await auth.api.getSession({
    headers: { cookie: cookieHeader }
  });

  const user = session?.user as AuthUser | undefined;
  if (!user?.id) return null;

  return {
    id: user.id,
    role: user.role
  };
}

export async function requireAuthenticated(): Promise<AuthResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, status: 401, error: 'NÃ£o autenticado.' };
  }

  return { ok: true, user };
}

export async function requireCourseManager(): Promise<AuthResult> {
  const authResult = await requireAuthenticated();
  if (!authResult.ok) return authResult;

  if (!canUpdateCourse(authResult.user.role)) {
    return { ok: false, status: 403, error: 'Acesso negado.' };
  }

  return authResult;
}

export async function requireCourseDeletion(): Promise<AuthResult> {
  const authResult = await requireAuthenticated();
  if (!authResult.ok) return authResult;

  if (!canDeleteCourse(authResult.user.role)) {
    return { ok: false, status: 403, error: 'Acesso negado.' };
  }

  return authResult;
}

export async function requireVisitorSearchAccess(): Promise<AuthResult> {
  const authResult = await requireAuthenticated();
  if (!authResult.ok) return authResult;

  if (!isAdmin(authResult.user.role) && !isDirector(authResult.user.role)) {
    return { ok: false, status: 403, error: 'Acesso negado.' };
  }

  return authResult;
}

async function requireCourseIndicatorAccess(
  course:
    | Pick<Course, 'id' | 'slug' | 'coordinatorId'>
    | null
): Promise<AuthResult<{ course: Pick<Course, 'id' | 'slug' | 'coordinatorId'> }>> {
  if (!course) {
    return { ok: false, status: 404, error: 'Curso nÃ£o encontrado.' };
  }

  const authResult = await requireAuthenticated();
  if (!authResult.ok) return authResult;

  const canEdit = canEditIndicator({
    role: authResult.user.role,
    userId: authResult.user.id,
    courseCoordinatorId: course.coordinatorId
  });

  if (!canEdit) {
    return { ok: false, status: 403, error: 'Acesso negado.' };
  }

  return { ok: true, user: authResult.user, course };
}

export async function requireCourseIndicatorAccessById(
  courseId: string
): Promise<AuthResult<{ course: Pick<Course, 'id' | 'slug' | 'coordinatorId'> }>> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, slug: true, coordinatorId: true }
  });

  return requireCourseIndicatorAccess(course);
}

export async function requireCourseIndicatorAccessBySlug(
  slug: string
): Promise<AuthResult<{ course: Pick<Course, 'id' | 'slug' | 'coordinatorId'> }>> {
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { id: true, slug: true, coordinatorId: true }
  });

  return requireCourseIndicatorAccess(course);
}
