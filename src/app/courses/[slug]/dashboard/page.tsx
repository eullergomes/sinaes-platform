import prisma from '@/utils/prisma';
import CourseDashboardClient from '@/components/CourseDashboardClient';
import { notFound } from 'next/navigation';

type DimId = '1' | '2' | '3';
type Status = 'Concluído' | 'Em edição' | 'Não atingido';

function mapGrade(grade: string | null) {
  if (grade === null) return null;
  if (grade === 'NSA') return null;
  const n = Number(grade);
  return Number.isFinite(n) ? n : null;
}

export default async function CourseDashboardPage({
  params
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) return notFound();

  const indicators = await prisma.courseIndicator.findMany({
    where: { courseId: course.id },
    include: { indicatorDef: true }
  });

  const clientIndicators = indicators.map((ci) => {
    const status: Status =
      ci.status === 'CONCLUIDO'
        ? 'Concluído'
        : ci.status === 'NAO_ATINGIDO'
          ? 'Não atingido'
          : 'Em edição';
    return {
      id: ci.id,
      dimension: (ci.indicatorDef.dimensionId ?? '1') as DimId,
      grade: mapGrade(ci.grade as unknown as string | null),
      status,
      lastUpdate: ci.lastUpdate
        ? ci.lastUpdate.toISOString().slice(0, 10)
        : null
    };
  });

  return (
    <CourseDashboardClient course={course} indicators={clientIndicators} />
  );
}
