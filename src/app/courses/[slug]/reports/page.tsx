import prisma from '@/utils/prisma';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import PrintButton from '@/components/print-button';
import CycleYearSelect from '@/components/CycleYearSelect';

type Params = { slug: string };

type ReportIndicator = {
  id: string;
  code: string;
  grade: string;
  justification: string;
  correctiveAction: string;
  responsible: string;
};

type ReportDimension = {
  number: number;
  indicators: ReportIndicator[];
};

function mapGradeRaw(g: string | null | undefined): string {
  if (!g) return '';
  if (g.startsWith('G')) return g.slice(1); // G1 -> 1
  return g;
}

export default async function ReportsPage({
  params,
  searchParams
}: {
  params: Promise<Params>;
  searchParams: Promise<{ year?: string }>;
}) {
  const { slug } = await params;
  const { year } = await searchParams;

  // Auth + role gating: bloquear anônimos e VISITOR
  const cookieHeader = (await headers()).get('cookie') ?? '';
  const session = await auth.api.getSession({
    headers: { cookie: cookieHeader }
  });
  const role = session?.user?.role as string | undefined;
  if (!session?.user || role === 'VISITOR') {
    redirect(`/courses/${slug}/dimensions`);
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    select: { id: true, slug: true, name: true }
  });
  if (!course) return notFound();

  // Descobrir anos disponíveis (mesmo padrão do dashboard)
  const allYearsRaw = await prisma.courseIndicator.findMany({
    where: { courseId: course.id },
    select: { evaluationYear: true }
  });
  const availableYears = Array.from(
    new Set(allYearsRaw.map((y) => y.evaluationYear))
  ).sort((a, b) => b - a);
  const selectedYear = (() => {
    const y = year ? parseInt(year, 10) : NaN;
    return !Number.isNaN(y) && availableYears.includes(y)
      ? y
      : (availableYears[0] ?? null);
  })();

  if (!selectedYear) {
    return (
      <div className="p-8 text-center">
        Nenhum ano de avaliação disponível para este curso.
      </div>
    );
  }

  // Buscar indicadores com plano de ação preenchido (grade G1..G4 e pelo menos um campo preenchido)
  const rawIndicators = await prisma.courseIndicator.findMany({
    where: {
      courseId: course.id,
      evaluationYear: selectedYear,
      grade: { in: ['G1', 'G2', 'G3', 'G4'] }
    },
    include: {
      indicatorDef: { include: { dimension: true } }
    },
    orderBy: { indicatorDefId: 'asc' }
  });

  const filtered = rawIndicators.filter((ci) => {
    return (
      (ci.justification && ci.justification.trim()) ||
      (ci.correctiveAction && ci.correctiveAction.trim()) ||
      (ci.responsible && ci.responsible.trim())
    );
  });

  const byDimensionMap = new Map<number, ReportDimension>();
  for (const ci of filtered) {
    const dimNumber = ci.indicatorDef.dimension.number;
    if (!byDimensionMap.has(dimNumber)) {
      byDimensionMap.set(dimNumber, { number: dimNumber, indicators: [] });
    }
    byDimensionMap.get(dimNumber)!.indicators.push({
      id: ci.id,
      code: ci.indicatorDef.code,
      grade: mapGradeRaw(ci.grade as unknown as string),
      justification: ci.justification || '',
      correctiveAction: ci.correctiveAction || '',
      responsible: ci.responsible || ''
    });
  }

  const dimensions: ReportDimension[] = Array.from(
    byDimensionMap.values()
  ).sort((a, b) => a.number - b.number);

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatório de Ações Corretivas</h1>
          <p className="text-muted-foreground mt-2 text-sm hidden print:block">
            Ano selecionado: {selectedYear} • Curso: {course.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <CycleYearSelect
            years={availableYears}
            value={selectedYear}
            placeholder="Ano"
            hideInPrint={true}
            updateQueryParam={true}
          />
          <PrintButton />
        </div>
      </div>

      {dimensions.length === 0 ? (
        <div className="text-muted-foreground">
          Nenhum plano de ação preenchido para este ano.
        </div>
      ) : (
        dimensions.map((dim) => (
          <div key={dim.number} className="space-y-4">
            <h3 className="text-xl font-bold">Dimensão {dim.number}</h3>
            {dim.indicators.map((ind) => (
              <div key={ind.id} className="space-y-2 rounded-md border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium">Indicador {ind.code}</div>
                  <div className="text-sm">
                    Nota: <span className="font-semibold">{ind.grade}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-fixed border text-sm">
                    <colgroup>
                      <col className="w-1/3" />
                      <col className="w-1/3" />
                      <col className="w-1/3" />
                    </colgroup>
                    <thead className="bg-green-600 text-white">
                      <tr>
                        <th className="border p-2 text-left font-semibold">
                          Justificativa
                        </th>
                        <th className="border p-2 text-left font-semibold">
                          Ação corretiva
                        </th>
                        <th className="border p-2 text-left font-semibold">
                          Responsável
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2 align-top whitespace-pre-wrap">
                          {ind.justification || '—'}
                        </td>
                        <td className="border p-2 align-top whitespace-pre-wrap">
                          {ind.correctiveAction || '—'}
                        </td>
                        <td className="border p-2 align-top whitespace-pre-wrap">
                          {ind.responsible || '—'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
      {/* Footer exclusivo para impressão */}
      <div className="print-footer hidden">
        <span className="generated-at">
          Gerado em: {new Date().toLocaleString('pt-BR')}
        </span>
        {/* Footer exclusivo para impressão (data); numeração via @page */}
      </div>
    </div>
  );
}
