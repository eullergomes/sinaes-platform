import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { IndicatorStatus } from '@prisma/client';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string; dimensionId: string; indicatorCode: string }> }
) {
  const { slug, dimensionId, indicatorCode } = await params;
  const dimNumber = parseInt(dimensionId, 10);

  if (!slug || !indicatorCode || isNaN(dimNumber)) {
    return NextResponse.json(
      { error: 'Parâmetros inválidos.' },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
  }

  const { status, year } = (body || {}) as { status?: IndicatorStatus; year?: number };
  if (!status || !Object.values(IndicatorStatus).includes(status)) {
    return NextResponse.json({ error: 'Status inválido.' }, { status: 400 });
  }
  if (typeof year !== 'number' || !Number.isInteger(year)) {
    return NextResponse.json({ error: 'Ano inválido.' }, { status: 400 });
  }

  try {
    const course = await prisma.course.findUnique({ where: { slug } });
    if (!course) {
      return NextResponse.json({ error: 'Curso não encontrado.' }, { status: 404 });
    }

    const dimensionDef = await prisma.dimensionDefinition.findUnique({ where: { number: dimNumber } });
    if (!dimensionDef) {
      return NextResponse.json({ error: 'Dimensão não encontrada.' }, { status: 404 });
    }

    const indicatorDef = await prisma.indicatorDefinition.findFirst({ where: { code: indicatorCode, dimensionId: dimensionDef.id } });
    if (!indicatorDef) {
      return NextResponse.json({ error: 'Indicador não encontrado nesta dimensão.' }, { status: 404 });
    }

    // Update only if the evaluation exists for the given year
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

    return NextResponse.json({ success: true, status: updated.status, lastUpdate: updated.lastUpdate });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // If no matching record, Prisma throws
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Avaliação do indicador não encontrada para o ano informado.' }, { status: 404 });
    }
    console.error('Falha ao atualizar status do indicador:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
