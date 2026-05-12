import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { IndicatorStatus } from '@prisma/client';
import { requireCourseIndicatorAccessBySlug } from '@/lib/server-auth';

export async function PATCH(
  request: Request,
  {
    params
  }: {
    params: Promise<{
      slug: string;
      dimensionId: string;
      indicatorCode: string;
    }>;
  }
) {
  const { slug, dimensionId, indicatorCode } = await params;
  const dimNumber = parseInt(dimensionId, 10);

  if (!slug || !indicatorCode || isNaN(dimNumber)) {
    return NextResponse.json(
      { error: 'ParÃ¢metros invÃ¡lidos.' },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON invÃ¡lido.' }, { status: 400 });
  }

  const { status, year } = (body || {}) as {
    status?: IndicatorStatus;
    year?: number;
  };
  if (!status || !Object.values(IndicatorStatus).includes(status)) {
    return NextResponse.json({ error: 'Status invÃ¡lido.' }, { status: 400 });
  }
  if (typeof year !== 'number' || !Number.isInteger(year)) {
    return NextResponse.json({ error: 'Ano invÃ¡lido.' }, { status: 400 });
  }

  try {
    const authResult = await requireCourseIndicatorAccessBySlug(slug);
    if (!authResult.ok) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }
    const { course } = authResult;

    const dimensionDef = await prisma.dimensionDefinition.findUnique({
      where: { number: dimNumber }
    });
    if (!dimensionDef) {
      return NextResponse.json(
        { error: 'DimensÃ£o nÃ£o encontrada.' },
        { status: 404 }
      );
    }

    const indicatorDef = await prisma.indicatorDefinition.findFirst({
      where: { code: indicatorCode, dimensionId: dimensionDef.id }
    });
    if (!indicatorDef) {
      return NextResponse.json(
        { error: 'Indicador nÃ£o encontrado nesta dimensÃ£o.' },
        { status: 404 }
      );
    }

    const updated = await prisma.courseIndicator.update({
      where: {
        courseId_indicatorDefId_evaluationYear: {
          courseId: course.id,
          indicatorDefId: indicatorDef.id,
          evaluationYear: year
        }
      },
      data: { status, lastUpdate: new Date() },
      select: { status: true, lastUpdate: true }
    });

    return NextResponse.json({
      success: true,
      status: updated.status,
      lastUpdate: updated.lastUpdate
    });
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'AvaliaÃ§Ã£o do indicador nÃ£o encontrada para o ano informado.' },
        { status: 404 }
      );
    }
    console.error('Falha ao atualizar status do indicador:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
