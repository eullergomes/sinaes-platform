import prisma from '@/utils/prisma';
import CourseDashboardClient from '@/components/CourseDashboardClient';
import { notFound } from 'next/navigation';
import { mapGrade } from '@/utils/mapGrade';

type DimId = '1' | '2' | '3';
type Status = 'Concluído' | 'Em edição' | 'Não atingido';

export default async function CourseDashboardPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ year?: string }>;
}) {
  const { slug } = await params;
  const { year } = await searchParams;

  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) return notFound();

  const allYearsRaw = await prisma.courseIndicator.findMany({
    where: { courseId: course.id },
    select: { evaluationYear: true }
  });
  const availableYears = Array.from(
    new Set(allYearsRaw.map((y) => y.evaluationYear))
  ).sort((a, b) => b - a);
  const selectedYear = (() => {
    const y = year ? parseInt(year, 10) : NaN;
    return !Number.isNaN(y) && availableYears.includes(y)
      ? y
      : (availableYears[0] ?? null);
  })();

  const indicatorsOfYear = await prisma.courseIndicator.findMany({
    where: {
      courseId: course.id,
      evaluationYear: selectedYear ?? undefined,
      nsaApplicable: true
    },
    include: { indicatorDef: { include: { dimension: true } } },
    orderBy: { indicatorDefId: 'asc' }
  });

  const clientIndicators = indicatorsOfYear.map((ci) => {
    const status: Status =
      ci.status === 'CONCLUIDO'
        ? 'Concluído'
        : ci.status === 'NAO_ATINGIDO'
          ? 'Não atingido'
          : 'Em edição';
    return {
      id: ci.id,
      dimension: String(ci.indicatorDef.dimension.number) as DimId,
      code: ci.indicatorDef.code,
      grade: mapGrade(ci.grade as unknown as string | null),
      status,
      lastUpdate: ci.lastUpdate
        ? ci.lastUpdate.toISOString().slice(0, 10)
        : null
    };
  });

  return (
    <CourseDashboardClient
      course={course}
      indicators={clientIndicators}
      availableYears={availableYears}
      selectedYear={selectedYear ?? undefined}
    />
  );
}
