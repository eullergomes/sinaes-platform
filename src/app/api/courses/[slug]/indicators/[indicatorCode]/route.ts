import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; indicatorCode: string }> }
) {
  const { slug, indicatorCode } = await params;
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const evaluationYear = year ? Number(year) : null;

  if (
    !slug ||
    !indicatorCode ||
    !evaluationYear ||
    Number.isNaN(evaluationYear)
  ) {
    return NextResponse.json(
      {
        error: 'Parâmetros inválidos (curso, indicador e ano são obrigatórios).'
      },
      { status: 400 }
    );
  }

  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      select: { id: true, slug: true, name: true }
    });
    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado.' },
        { status: 404 }
      );
    }

    const indicatorDef = await prisma.indicatorDefinition.findUnique({
      where: { code: indicatorCode },
      include: {
        requirements: {
          include: {
            requirement: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!indicatorDef) {
      return NextResponse.json(
        { error: 'Definição do Indicador não encontrada.' },
        { status: 404 }
      );
    }

    const evaluationData = await prisma.courseIndicator.findFirst({
      where: {
        courseId: course.id,
        indicatorDefId: indicatorDef.id,
        evaluationYear
      },
      select: {
        grade: true,
        justification: true,
        correctiveAction: true,
        responsible: true,
        nsaApplicable: true
      }
    });

    const requirementIds = indicatorDef.requirements.map(
      (r) => r.requirement.id
    );
    const evidenceSubmissions = await prisma.evidenceSubmission.findMany({
      where: {
        courseId: course.id,
        requirementId: { in: requirementIds }
      },
      include: {
        files: {
          select: {
            fileName: true,
            sizeBytes: true,
            externalUrl: true,
            storageKey: true
          }
        },
        links: {
          select: { id: true, text: true, url: true, order: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    const submissionsMap = new Map(
      evidenceSubmissions.map((s) => [s.requirementId, s])
    );

    const response = {
      course: {
        id: course.id,
        slug: course.slug,
        name: course.name
      },
      indicator: {
        id: indicatorDef.id,
        code: indicatorDef.code,
        name: indicatorDef.name,
        criteriaTable: indicatorDef.criteriaTable
      },
      evaluation: evaluationData,
      requiredEvidences: indicatorDef.requirements.map((req) => {
        const submission = submissionsMap.get(req.requirement.id) || null;
        return {
          id: req.requirement.id,
          slug: req.requirement.slug,
          title: req.requirement.title,
          submission: submission
            ? (() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const sub = submission as any;
                return {
                  folderUrls: sub.folderUrls,
                  links: Array.isArray(sub.links)
                    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      sub.links.map((l: any) => ({
                        id: l.id,
                        text: l.text,
                        url: l.url
                      }))
                    : [],
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  files: (sub.files as any[]).map((f: any) => ({
                    fileName: f.fileName,
                    sizeBytes: f.sizeBytes,
                    url: f.externalUrl,
                    publicId: f.storageKey // Usado para identificar arquivos existentes
                  }))
                };
              })()
            : null
        };
      })
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Falha ao buscar dados do indicador:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
