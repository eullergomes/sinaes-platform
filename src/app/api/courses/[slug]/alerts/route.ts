import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { IndicatorStatus } from '@prisma/client';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const url = new URL(req.url);
  const yearParam = url.searchParams.get('year');
  const filterYear = yearParam ? parseInt(yearParam, 10) : undefined;

  if (!slug) {
    return NextResponse.json({ error: 'Slug inválido' }, { status: 400 });
  }

  try {
    const course = await prisma.course.findUnique({ where: { slug } });
    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    const indicatorDefs = await prisma.indicatorDefinition.findMany({
      include: { dimension: { select: { number: true, title: true } } }
    });
    const defById = new Map(indicatorDefs.map((d) => [d.id, d]));

    const indicators = await prisma.courseIndicator.findMany({
      where: {
        courseId: course.id,
        status: {
          in: [IndicatorStatus.EM_EDICAO, IndicatorStatus.NAO_ATINGIDO]
        },
        nsaApplicable: true
      },
      select: {
        indicatorDefId: true,
        evaluationYear: true,
        status: true,
        lastUpdate: true
      }
    });

    if (indicators.length === 0) {
      return NextResponse.json({
        course: { id: course.id, slug: course.slug, name: course.name },
        availableYears: [],
        alerts: [],
        alertsByYear: {}
      });
    }

    const yearSet = new Set<number>();

    type AlertItem = {
      dimensionId: number;
      dimensionLabel: string;
      code: string;
      name: string;
      status: IndicatorStatus;
      lastUpdate: string | null;
      year: number;
    };

    const allAlerts: AlertItem[] = [];

    for (const ci of indicators) {
      const def = defById.get(ci.indicatorDefId);
      if (!def) continue;
      yearSet.add(ci.evaluationYear);
      const item: AlertItem = {
        dimensionId: def.dimension.number,
        dimensionLabel: `Dimensão ${def.dimension.number}`,
        code: def.code,
        name: def.name,
        status: ci.status,
        lastUpdate: ci.lastUpdate ? ci.lastUpdate.toISOString() : null,
        year: ci.evaluationYear
      };
      allAlerts.push(item);
    }

    const availableYears = Array.from(yearSet).sort((a, b) => b - a);

    if (filterYear) {
      const filtered = allAlerts
        .filter((a) => a.year === filterYear)
        .sort(
          (a, b) =>
            a.dimensionId - b.dimensionId || a.code.localeCompare(b.code)
        );
      return NextResponse.json({
        course: { id: course.id, slug: course.slug, name: course.name },
        availableYears,
        year: filterYear,
        alerts: filtered
      });
    }

    const alertsByYear: Record<string, AlertItem[]> = {};
    for (const a of allAlerts) {
      const key = String(a.year);
      if (!alertsByYear[key]) alertsByYear[key] = [];
      alertsByYear[key].push(a);
    }
    for (const key of Object.keys(alertsByYear)) {
      alertsByYear[key].sort(
        (a, b) => a.dimensionId - b.dimensionId || a.code.localeCompare(b.code)
      );
    }

    return NextResponse.json({
      course: { id: course.id, slug: course.slug, name: course.name },
      availableYears,
      alertsByYear
    });
  } catch (error) {
    console.error('Erro ao gerar alertas:', error);
    return NextResponse.json(
      { error: 'Erro interno ao gerar alertas' },
      { status: 500 }
    );
  }
}
