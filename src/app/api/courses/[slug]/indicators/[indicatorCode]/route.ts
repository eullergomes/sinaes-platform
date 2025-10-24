import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; indicatorCode: string }> }
) {
  const { slug, indicatorCode } = await params;
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');

  if (!slug || !indicatorCode || !year) {
    return NextResponse.json({ error: 'Parâmetros inválidos (curso, indicador e ano são obrigatórios).' }, { status: 400 });
  }

  try {
    const course = await prisma.course.findUnique({ where: { slug } });
    if (!course) {
      return NextResponse.json({ error: 'Curso não encontrado.' }, { status: 404 });
    }

    const indicatorDef = await prisma.indicatorDefinition.findUnique({
      where: { code: indicatorCode },
      include: {
        requirements: {
          include: {
            requirement: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!indicatorDef) {
      return NextResponse.json({ error: 'Indicador não encontrado.' }, { status: 404 });
    }

    const evaluationData = await prisma.courseIndicator.findUnique({
      where: {
        courseId_indicatorDefId_evaluationYear: {
          courseId: course.id,
          indicatorDefId: indicatorDef.id,
          evaluationYear: parseInt(year),
        },
      },
    });

    const requirementIds = indicatorDef.requirements.map(r => r.requirement.id);
    const evidenceSubmissions = await prisma.evidenceSubmission.findMany({
        where: {
            courseId: course.id,
            requirementId: { in: requirementIds }
        },
        include: {
            files: true
        }
    });

    const submissionsMap = new Map(evidenceSubmissions.map(s => [s.requirementId, s]));

    const response = {
      indicator: {
        code: indicatorDef.code,
        name: indicatorDef.name,
        criteriaTable: indicatorDef.criteriaTable,
      },
      evaluation: evaluationData,
      requiredEvidences: indicatorDef.requirements.map(req => ({
        ...req.requirement,
        submission: submissionsMap.get(req.requirement.id) || null,
      })),
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Falha ao buscar dados do indicador:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
