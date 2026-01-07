'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/utils/prisma';
import { CourseLevel, CourseModality, UserRole } from '@prisma/client';
import { courseSchema, CourseInput } from '@/lib/validators/course';

export type CreateCourseState = {
  error?: string;
  success?: boolean;
  fieldErrors?: Partial<Record<keyof CourseInput, string>>;
  eventId?: string;
};

const newEvent = () => Date.now().toString();

const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

export async function createCourse(
  prevState: CreateCourseState,
  formData: FormData
): Promise<CreateCourseState> {
  const raw = {
    name: (formData.get('name') as string) ?? '',
    level: formData.get('level') as unknown as CourseLevel,
    modality: formData.get('modality') as unknown as CourseModality,
    emecCode: ((formData.get('emecCode') as string) ?? '').trim(),
    ppcDocumentUrl: ((formData.get('ppcDocumentUrl') as string) ?? '').trim(),
    coordinatorId: ((formData.get('coordinatorId') as string) ?? '').trim()
  };

  const parsed = courseSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof CourseInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const pathKey = issue.path[0];
      if (typeof pathKey === 'string') {
        const key = pathKey as keyof CourseInput;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
    }
    return { fieldErrors, eventId: newEvent() };
  }

  const { name, level, modality, emecCode, ppcDocumentUrl, coordinatorId } =
    parsed.data;
  const slug = createSlug(name);

  try {
    const existingCourseBySlug = await prisma.course.findUnique({
      where: { slug }
    });
    if (existingCourseBySlug) {
      return {
        error: `Um curso com o nome "${name}" já existe.`,
        eventId: newEvent()
      };
    }
    if (emecCode) {
      const existingCourseByEmec = await prisma.course.findUnique({
        where: { emecCode }
      });
      if (existingCourseByEmec) {
        return {
          error: `O código e-MEC "${emecCode}" já está em uso.`,
          eventId: newEvent()
        };
      }
    }

    if (coordinatorId) {
      const existingByCoordinator = await prisma.course.findFirst({
        where: { coordinatorId }
      });
      if (existingByCoordinator) {
        return {
          fieldErrors: {
            coordinatorId:
              'Este(a) coordenador(a) já está atribuído(a) a outro curso.'
          },
          eventId: newEvent()
        };
      }
    }

    await prisma.$transaction(async (tx) => {
      // Promote selected coordinator if currently VISITOR
      if (coordinatorId) {
        const coord = await tx.user.findUnique({
          where: { id: coordinatorId },
          select: { role: true }
        });
        if (coord?.role === UserRole.VISITOR) {
          await tx.user.update({
            where: { id: coordinatorId },
            data: { role: UserRole.COORDINATOR }
          });
        }
      }

      await tx.course.create({
        data: {
          name,
          slug,
          level,
          modality,
          emecCode,
          ppcDocumentUrl,
          coordinatorId: coordinatorId
        }
      });
    });
  } catch (error) {
    console.error('Falha detalhada ao criar curso:', error);
    return {
      error:
        'Não foi possível criar o curso devido a um erro inesperado no banco de dados.',
      eventId: newEvent()
    };
  }

  revalidateTag('courses');
  revalidatePath('/courses');

  const e = newEvent();
  redirect(`/courses?created=1&e=${e}`);

  return { success: true };
}

export async function deleteCourse(formData: FormData) {
  const courseId = formData.get('courseId') as string;

  if (!courseId) {
    throw new Error('ID do curso é obrigatório.');
  }

  try {
    await prisma.$transaction(async (tx) => {
      const course = await tx.course.findUnique({
        where: { id: courseId },
        select: { coordinatorId: true }
      });
      if (!course) {
        throw new Error('Curso não encontrado.');
      }

      const coordinatorId = course.coordinatorId ?? null;
      if (coordinatorId) {
        const coord = await tx.user.findUnique({
          where: { id: coordinatorId },
          select: { role: true }
        });
        if (coord?.role === UserRole.COORDINATOR) {
          await tx.user.update({
            where: { id: coordinatorId },
            data: { role: UserRole.VISITOR }
          });
        }
      }

      await tx.course.delete({ where: { id: courseId } });
    });
  } catch (error) {
    console.error('Falha ao apagar o curso:', error);
    throw new Error('Não foi possível apagar o curso.');
  }

  revalidateTag('courses');
  revalidatePath('/courses');

  const e = newEvent();
  redirect(`/courses?deleted=1&e=${e}`);
}

export async function updateCourse(
  prevState: CreateCourseState,
  formData: FormData
): Promise<CreateCourseState> {
  const courseId = (formData.get('courseId') as string) ?? '';
  if (!courseId) {
    return { error: 'ID do curso é obrigatório.', eventId: newEvent() };
  }

  const raw = {
    name: (formData.get('name') as string) ?? '',
    level: formData.get('level') as unknown as CourseLevel,
    modality: formData.get('modality') as unknown as CourseModality,
    emecCode: ((formData.get('emecCode') as string) ?? '').trim(),
    ppcDocumentUrl: ((formData.get('ppcDocumentUrl') as string) ?? '').trim(),
    coordinatorId: ((formData.get('coordinatorId') as string) ?? '').trim()
  };

  const parsed = courseSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof CourseInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const pathKey = issue.path[0];
      if (typeof pathKey === 'string') {
        const key = pathKey as keyof CourseInput;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
    }
    return { fieldErrors, eventId: newEvent() };
  }

  const { name, level, modality, emecCode, ppcDocumentUrl, coordinatorId } =
    parsed.data;
  const slug = createSlug(name);

  try {
    const existing = await prisma.course.findUnique({
      where: { id: courseId }
    });
    if (!existing) {
      return { error: 'Curso não encontrado.', eventId: newEvent() };
    }
    const bySlug = await prisma.course.findUnique({ where: { slug } });
    if (bySlug && bySlug.id !== courseId) {
      return {
        error: `Já existe um curso com o nome "${name}".`,
        eventId: newEvent()
      };
    }
    if (emecCode) {
      const byEmec = await prisma.course.findUnique({ where: { emecCode } });
      if (byEmec && byEmec.id !== courseId) {
        return {
          error: `O código e-MEC "${emecCode}" já está em uso.`,
          eventId: newEvent()
        };
      }
    }

    if (coordinatorId) {
      const byCoordinator = await prisma.course.findFirst({
        where: { coordinatorId }
      });
      if (byCoordinator && byCoordinator.id !== courseId) {
        return {
          fieldErrors: {
            coordinatorId:
              'Este(a) coordenador(a) já está atribuído(a) a outro curso.'
          },
          eventId: newEvent()
        };
      }
    }

    await prisma.$transaction(async (tx) => {
      // Demote previous coordinator if being replaced
      const prev = await tx.course.findUnique({
        where: { id: courseId },
        select: { coordinatorId: true }
      });
      const prevCoordinatorId = prev?.coordinatorId ?? null;

      if (prevCoordinatorId && prevCoordinatorId !== coordinatorId) {
        const prevUser = await tx.user.findUnique({
          where: { id: prevCoordinatorId },
          select: { role: true }
        });
        // Only demote if they are actually COORDINATOR (don't touch ADMIN/DIRECTOR)
        if (prevUser?.role === UserRole.COORDINATOR) {
          await tx.user.update({
            where: { id: prevCoordinatorId },
            data: { role: UserRole.VISITOR }
          });
        }
      }

      // Promote new coordinator if currently VISITOR
      if (coordinatorId) {
        const newUser = await tx.user.findUnique({
          where: { id: coordinatorId },
          select: { role: true }
        });
        if (newUser?.role === UserRole.VISITOR) {
          await tx.user.update({
            where: { id: coordinatorId },
            data: { role: UserRole.COORDINATOR }
          });
        }
      }

      await tx.course.update({
        where: { id: courseId },
        data: {
          name,
          slug,
          level,
          modality,
          emecCode,
          ppcDocumentUrl,
          coordinatorId
        }
      });
    });
  } catch (error) {
    console.error('Falha ao atualizar curso:', error);
    return {
      error:
        'Não foi possível atualizar o curso devido a um erro inesperado no banco de dados.',
      eventId: newEvent()
    };
  }

  revalidateTag('courses');
  revalidatePath('/courses');

  const e = newEvent();
  redirect(`/courses?updated=1&e=${e}`);

  return { success: true, eventId: e };
}
