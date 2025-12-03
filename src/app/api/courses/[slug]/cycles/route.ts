import { NextResponse } from 'next/server';
import {
  PrismaClient,
  IndicatorGrade,
  IndicatorStatus,
  UserRole
} from '@prisma/client';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const rawYear = body.year;
  const copyFromPrevious =
    body.copyFromPrevious === true || body.copyFromPrevious === 'true';
  const year =
    typeof rawYear === 'string' || typeof rawYear === 'number'
      ? parseInt(String(rawYear), 10)
      : NaN;

  if (!slug || !Number.isInteger(year) || year < 1900) {
    return NextResponse.json(
      { error: 'Parâmetros inválidos' },
      { status: 400 }
    );
  }

  try {
    // AuthN/AuthZ: apenas ADMIN pode criar para qualquer curso; COORDINATOR somente para seu curso
    const cookieHeader = (await headers()).get('cookie') ?? '';
    const session = await auth.api.getSession({
      headers: { cookie: cookieHeader }
    });
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const requesterRole = session.user.role as UserRole | string | undefined;

    const course = await prisma.course.findUnique({ where: { slug } });
    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    const isAdmin =
      requesterRole === 'ADMIN' || requesterRole === UserRole.ADMIN;
    const isCoordinator =
      requesterRole === 'COORDINATOR' || requesterRole === UserRole.COORDINATOR;
    if (!isAdmin) {
      if (!isCoordinator) {
        return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
      }
      // Coordinator: somente se for o coordenador do curso
      if (!course.coordinatorId || course.coordinatorId !== session.user.id) {
        return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
      }
    }

    const existingForYear = await prisma.courseIndicator.findFirst({
      where: { courseId: course.id, evaluationYear: year },
      select: { id: true }
    });
    if (existingForYear) {
      return NextResponse.json(
        { error: `Já existe um ciclo para o ano ${year}.` },
        { status: 409 }
      );
    }

    const indicatorDefs = await prisma.indicatorDefinition.findMany({
      select: { id: true, nsaPolicy: true }
    });
    if (indicatorDefs.length === 0) {
      return NextResponse.json(
        { error: 'Não há indicadores definidos no sistema.' },
        { status: 422 }
      );
    }

    let prevByIndicator: Map<
      string,
      {
        grade: IndicatorGrade;
        status: IndicatorStatus;
        nsaApplicable: boolean;
        nsaLocked: boolean;
        justification: string | null;
        correctiveAction: string | null;
        responsible: string | null;
      }
    > | null = null;

    if (copyFromPrevious) {
      const prevAgg = await prisma.courseIndicator.aggregate({
        _max: { evaluationYear: true },
        where: { courseId: course.id, evaluationYear: { lt: year } }
      });
      const prevYear = prevAgg._max.evaluationYear;
      if (prevYear) {
        const prevIndicators = await prisma.courseIndicator.findMany({
          where: { courseId: course.id, evaluationYear: prevYear },
          select: {
            indicatorDefId: true,
            grade: true,
            status: true,
            nsaApplicable: true,
            nsaLocked: true,
            justification: true,
            correctiveAction: true,
            responsible: true
          }
        });
        prevByIndicator = new Map(
          prevIndicators.map((pi) => [pi.indicatorDefId, pi])
        );
      }
    }

    const defaultsByPolicy = (policy: import('@prisma/client').NsaPolicy) => {
      switch (policy) {
        case 'FIXED_APPLICABLE':
          return { nsaApplicable: true, nsaLocked: true } as const;
        case 'FIXED_NSA':
          return { nsaApplicable: false, nsaLocked: true } as const;
        case 'COURSE_DEPENDENT':
        default:
          return { nsaApplicable: true, nsaLocked: false } as const;
      }
    };

    const data = indicatorDefs.map((d) => {
      const prev = prevByIndicator?.get(d.id);
      const policyDefaults = defaultsByPolicy(d.nsaPolicy);
      return {
        courseId: course.id,
        indicatorDefId: d.id,
        evaluationYear: year,
        grade: prev?.grade ?? IndicatorGrade.NSA,
        status: prev?.status ?? IndicatorStatus.NAO_ATINGIDO,
        nsaApplicable: prev?.nsaApplicable ?? policyDefaults.nsaApplicable,
        nsaLocked: prev?.nsaLocked ?? policyDefaults.nsaLocked,
        justification: prev?.justification ?? null,
        correctiveAction: prev?.correctiveAction ?? null,
        responsible: prev?.responsible ?? null
      };
    });

    const res = await prisma.courseIndicator.createMany({ data });

    return NextResponse.json(
      { created: res.count, year, copied: Boolean(prevByIndicator) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar ciclo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
