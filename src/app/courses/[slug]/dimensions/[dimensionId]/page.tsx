import ClientDimensionPage from '@/components/ClientDimensionPage';
import prisma from '@/utils/prisma';
import { redirect } from 'next/navigation';
import { DimensionApiResponse } from '@/types/dimension-types';
import { IndicatorGrade as LocalIndicatorGrade } from '@prisma/client';
import { IndicatorStatus } from '@prisma/client';

type Params = { slug: string; dimensionId: string };
type SearchParams = { year?: string };

export default async function DimensionPage({
  params,
  searchParams
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await params;
  const { slug, dimensionId: dimId } = resolved;
  const { year } = await searchParams;

  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) {
    return <div>Curso não encontrado.</div>;
  }

  const latestEvaluation = await prisma.courseIndicator.aggregate({
    _max: { evaluationYear: true },
    where: { courseId: course.id }
  });
  const latestYear = latestEvaluation._max.evaluationYear;
  if (!latestYear) {
    redirect(`/courses/${slug}/dimensions`);
  }

  const dimensionDef = await prisma.dimensionDefinition.findUnique({
    where: { number: parseInt(dimId, 10) }
  });

  let initialDimension: DimensionApiResponse | undefined;
  if (dimensionDef) {
    const indicatorDefs = await prisma.indicatorDefinition.findMany({
      where: { dimensionId: dimensionDef.id }
    });

    indicatorDefs.sort((a, b) => {
      const [aMajor, aMinor] = a.code.split('.').map(Number);
      const [bMajor, bMinor] = b.code.split('.').map(Number);
      if (aMajor !== bMajor) return aMajor - bMajor;
      return aMinor - bMinor;
    });

    const evaluations = await prisma.courseIndicator.findMany({
      where: {
        courseId: course.id,
        indicatorDefId: { in: indicatorDefs.map((d) => d.id) }
      },
      select: {
        indicatorDefId: true,
        evaluationYear: true,
        grade: true,
        status: true,
        nsaApplicable: true,
        nsaLocked: true,
        lastUpdate: true
      }
    });

    const evalMap = new Map<
      string,
      {
        year: number;
        grade: LocalIndicatorGrade;
        status: IndicatorStatus;
        nsaApplicable: boolean;
        nsaLocked: boolean;
        lastUpdate: string | null;
      }[]
    >();

    for (const ev of evaluations) {
      if (!evalMap.has(ev.indicatorDefId)) evalMap.set(ev.indicatorDefId, []);
      evalMap.get(ev.indicatorDefId)!.push({
        year: ev.evaluationYear,
        grade: ev.grade as unknown as LocalIndicatorGrade,
        status: ev.status,
        nsaApplicable: ev.nsaApplicable,
        nsaLocked: ev.nsaLocked,
        lastUpdate: ev.lastUpdate ? ev.lastUpdate.toISOString() : null
      });
    }

    const responseIndicators = indicatorDefs.map((def) => {
      const list = evalMap.get(def.id) || [];
      list.sort((a, b) => b.year - a.year);
      return {
        code: def.code,
        name: def.name,
        evaluations: list
      };
    });

    initialDimension = {
      course: { name: course.name, slug: course.slug },
      dimension: { number: dimensionDef.number, title: dimensionDef.title },
      indicators: responseIndicators
    };
  }

  return (
    <ClientDimensionPage
      slug={slug}
      dimId={dimId}
      year={year}
      initialDimension={initialDimension}
    />
  );
}
