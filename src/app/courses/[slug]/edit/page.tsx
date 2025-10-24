import prisma from '@/utils/prisma';
import EditCourseForm, { type EditCourseInitial } from './EditCourseForm';
import { notFound } from 'next/navigation';

type Params = Promise<{ slug: string }>;

export default async function EditCoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
    include: { coordinator: { select: { id: true, name: true } } }
  });

  if (!course) return notFound();

  const initial: EditCourseInitial = {
    id: course.id,
    name: course.name,
    emecCode: course.emecCode ?? null,
    level: course.level ?? null,
    modality: course.modality ?? null,
    coordinator: course.coordinator
      ? { id: course.coordinator.id, name: course.coordinator.name }
      : null
  };

  return <EditCourseForm initial={initial} />;
}
