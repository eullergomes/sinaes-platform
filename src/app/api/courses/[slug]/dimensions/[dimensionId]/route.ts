import { NextResponse } from 'next/server';
import { PrismaClient, IndicatorGrade, IndicatorStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; dimensionId: string }> }
) {
  const { slug, dimensionId } = await params;
  const dimNumber = parseInt(dimensionId, 10);

  if (!slug || isNaN(dimNumber)) {
    return NextResponse.json(
      { error: 'Parâmetros inválidos' },
      { status: 400 }
    );
  }

  try {
    const course = await prisma.course.findUnique({ where: { slug } });
    const dimensionDef = await prisma.dimensionDefinition.findUnique({
      where: { number: dimNumber }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }
    if (!dimensionDef) {
      return NextResponse.json(
        { error: 'Dimensão não encontrada' },
        { status: 404 }
      );
    }

    const indicatorDefs = await prisma.indicatorDefinition.findMany({
      where: { dimensionId: dimensionDef.id }
    });

    indicatorDefs.sort((a, b) => {
      const [aMajor, aMinor] = a.code.split('.').map(Number);
      const [bMajor, bMinor] = b.code.split('.').map(Number);

      if (aMajor !== bMajor) {
        return aMajor - bMajor;
      }
      return aMinor - bMinor;
    });

    const evaluations = await prisma.courseIndicator.findMany({
      where: {
        courseId: course.id,
        indicatorDefId: {
          in: indicatorDefs.map((def) => def.id)
        }
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

    type EvaluationItem = {
      year: number;
      grade: IndicatorGrade;
      status: IndicatorStatus;
      nsaApplicable: boolean;
      nsaLocked: boolean;
      lastUpdate: Date | null;
    };
    const evaluationsMap = new Map<string, EvaluationItem[]>();
    for (const ev of evaluations) {
      if (!evaluationsMap.has(ev.indicatorDefId)) {
        evaluationsMap.set(ev.indicatorDefId, []);
      }
      evaluationsMap.get(ev.indicatorDefId)?.push({
        year: ev.evaluationYear,
        grade: ev.grade,
        status: ev.status,
        nsaApplicable: ev.nsaApplicable,
        nsaLocked: ev.nsaLocked,
        lastUpdate: ev.lastUpdate
      });
    }

    const responseIndicators = indicatorDefs.map((def) => {
      const indicatorEvaluations = evaluationsMap.get(def.id) || [];
      indicatorEvaluations.sort((a, b) => b.year - a.year);

      return {
        code: def.code,
        name: def.name,
        evaluations: indicatorEvaluations
      };
    });

    return NextResponse.json({
      course: { name: course.name, slug: course.slug },
      dimension: {
        number: dimensionDef.number,
        title: dimensionDef.title
      },
      indicators: responseIndicators
    });
  } catch (error) {
    console.error(`Falha ao buscar indicadores para o curso ${slug}:`, error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
