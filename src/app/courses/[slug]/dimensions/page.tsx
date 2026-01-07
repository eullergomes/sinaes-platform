import DimensionList from '@/components/dimension-list';
import { gradeToNumber } from '@/utils/gradeToNumber';
import prisma from '@/utils/prisma';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { UserRole } from '@prisma/client';

type Params = { slug: string };
type SearchParams = { year?: string };

type DimensionWithGrade = {
  id: string;
  number: number;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  averageGrade: number;
};

function parseYear(value: string | undefined): number | null {
  if (!value) return null;
  const parsed: number = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return null;
  if (!Number.isInteger(parsed)) return null;
  return parsed;
}

export default async function DimensionPage(props: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}): Promise<React.JSX.Element> {
  const { slug } = await props.params;
  const { year } = await props.searchParams;

  // 1) Course primeiro (resto depende do course.id)
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { id: true, coordinatorId: true, slug: true }
  });

  if (!course) {
    return <div>Curso não encontrado.</div>;
  }

  // 2) Rodar em paralelo tudo que depende do course.id (e o que não depende também)
  const [dimensions, yearsRows] = await Promise.all([
    prisma.dimensionDefinition.findMany({
      orderBy: { number: 'asc' },
      select: {
        id: true,
        number: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    // Em vez de aggregate + findFirst, buscamos os anos existentes uma vez.
    prisma.courseIndicator.findMany({
      where: { courseId: course.id },
      select: { evaluationYear: true },
      distinct: ['evaluationYear'],
      orderBy: { evaluationYear: 'desc' }
    })
  ]);

  const years: number[] = yearsRows
    .map(
      (r: { evaluationYear: number | null }): number | null => r.evaluationYear
    )
    .filter((v: number | null): v is number => typeof v === 'number');

  const latestYear: number | null = years.length > 0 ? years[0] : null;
  const hasCycles: boolean = Boolean(latestYear);

  // 3) Seleciona ano sem query extra
  const requestedYear: number | null = parseYear(year);
  let selectedYear: number | null = null;

  if (requestedYear !== null && years.includes(requestedYear)) {
    selectedYear = requestedYear;
  } else {
    selectedYear = latestYear;
  }

  // 4) Base: dimensões com nota 0
  let dimensionsWithGrades: DimensionWithGrade[] = dimensions.map((dim) => ({
    id: dim.id,
    number: dim.number,
    title: dim.title,
    description: dim.description,
    createdAt: dim.createdAt,
    updatedAt: dim.updatedAt,
    averageGrade: 0
  }));

  // 5) Se houver ano, buscamos indicadores com SELECT enxuto (sem include pesado)
  if (selectedYear !== null) {
    const indicators = await prisma.courseIndicator.findMany({
      where: {
        courseId: course.id,
        evaluationYear: selectedYear
      },
      select: {
        grade: true,
        indicatorDef: {
          select: { dimensionId: true }
        }
      }
    });

    const gradesByDimension: Map<string, { total: number; count: number }> =
      new Map();

    for (const indicator of indicators) {
      const dimId: string = indicator.indicatorDef.dimensionId;
      const gradeValue: number = gradeToNumber(indicator.grade);

      if (gradeValue > 0) {
        const current = gradesByDimension.get(dimId) ?? { total: 0, count: 0 };
        current.total += gradeValue;
        current.count += 1;
        gradesByDimension.set(dimId, current);
      }
    }

    dimensionsWithGrades = dimensions.map((dim) => {
      const gradeData = gradesByDimension.get(dim.id);
      const averageGrade: number =
        gradeData && gradeData.count > 0
          ? Number.parseFloat((gradeData.total / gradeData.count).toFixed(2))
          : 0;

      return {
        id: dim.id,
        number: dim.number,
        title: dim.title,
        description: dim.description,
        createdAt: dim.createdAt,
        updatedAt: dim.updatedAt,
        averageGrade
      };
    });
  }

  // 6) Session server-side (mantendo sua lógica)
  const cookieHeader: string = (await headers()).get('cookie') ?? '';
  const session = await auth.api.getSession({
    headers: { cookie: cookieHeader }
  });

  const role: UserRole | string | undefined = (session?.user?.role ??
    undefined) as UserRole | string | undefined;
  const isAdmin: boolean = role === 'ADMIN' || role === UserRole.ADMIN;
  const isCoordinator: boolean =
    role === 'COORDINATOR' || role === UserRole.COORDINATOR;

  const canCreateCycleServer: boolean = Boolean(
    isAdmin ||
      (isCoordinator &&
        Boolean(course.coordinatorId) &&
        session?.user?.id === course.coordinatorId)
  );

  return (
    <DimensionList
      slug={slug}
      dimensionsWithGrades={dimensionsWithGrades}
      hasCycles={hasCycles}
      currentYear={selectedYear}
      canCreateCycleInitial={canCreateCycleServer}
    />
  );
}
