import DimensionList from '@/components/dimension-list';
import { gradeToNumber } from '@/utils/gradeToNumber';
import prisma from '@/utils/prisma';

type Params = { slug: string };
type SearchParams = { year?: string };

const DimensionPage = async ({
  params,
  searchParams
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) => {
  const { slug } = await params;
  const { year } = await searchParams;

  const course = await prisma.course.findUnique({ where: { slug } });
  const dimensions = await prisma.dimensionDefinition.findMany({
    orderBy: {
      number: 'asc'
    }
  });

  if (!course) {
    // not found page
    return <div>Curso não encontrado.</div>;
  }

  const latestEvaluation = await prisma.courseIndicator.aggregate({
    _max: { evaluationYear: true },
    where: { courseId: course.id }
  });
  const latestYear = latestEvaluation._max.evaluationYear;
  const hasCycles = Boolean(latestYear);

  let selectedYear: number | null = null;
  if (year) {
    const parsed = parseInt(year, 10);
    if (Number.isInteger(parsed)) {
      const exists = await prisma.courseIndicator.findFirst({
        where: { courseId: course.id, evaluationYear: parsed },
        select: { id: true }
      });
      if (exists) selectedYear = parsed;
    }
  }
  if (!selectedYear) selectedYear = latestYear ?? null;

  let dimensionsWithGrades = dimensions.map((dim) => ({
    ...dim,
    averageGrade: 0
  }));

  if (selectedYear) {
    const indicators = await prisma.courseIndicator.findMany({
      where: {
        courseId: course.id,
        evaluationYear: selectedYear
      },
      include: {
        indicatorDef: {
          select: { dimensionId: true }
        }
      }
    });

    const gradesByDimension = new Map<
      string,
      { total: number; count: number }
    >();

    for (const indicator of indicators) {
      const dimId = indicator.indicatorDef.dimensionId;
      const gradeValue = gradeToNumber(indicator.grade);

      if (gradeValue > 0) {
        if (!gradesByDimension.has(dimId)) {
          gradesByDimension.set(dimId, { total: 0, count: 0 });
        }
        const current = gradesByDimension.get(dimId)!;
        current.total += gradeValue;
        current.count++;
      }
    }

    dimensionsWithGrades = dimensions.map((dim) => {
      const gradeData = gradesByDimension.get(dim.id);
      const averageGrade =
        gradeData && gradeData.count > 0
          ? parseFloat((gradeData.total / gradeData.count).toFixed(2))
          : 0;
      return { ...dim, averageGrade };
    });
  }

  return (
    <DimensionList
      slug={slug}
      dimensionsWithGrades={dimensionsWithGrades}
      hasCycles={hasCycles}
      currentYear={selectedYear}
    />
  );
};

export default DimensionPage;
