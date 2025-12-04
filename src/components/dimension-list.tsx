'use client';

import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip
} from 'recharts';
import { DimensionDefinition } from '@prisma/client';
import DimensionItem from './dimension-item';
import NewCycle from '@/components/new-cycle-dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import CycleYearSelect from '@/components/CycleYearSelect';
import { Download, PlusCircle, Loader2 } from 'lucide-react';
import ReportButton from './report-button';
import { UserRole } from '@prisma/client';
import { useAppContext } from '@/context/AppContext';
import { isVisitor as isVisitorRole } from '@/lib/permissions';
import { useCourseYears } from '@/hooks/useCourseYears';
import { useCreateCycle } from '@/hooks/useCreateCycle';

type DimensionWithGrade = DimensionDefinition & {
  averageGrade: number;
};

type Props = {
  slug: string;
  dimensionsWithGrades: DimensionWithGrade[];
  hasCycles: boolean;
  currentYear: number | null;
  canCreateCycleInitial?: boolean;
};

const DimensionList = ({
  slug,
  dimensionsWithGrades,
  hasCycles,
  currentYear,
  canCreateCycleInitial
}: Props) => {
  const {
    userId,
    role,
    courseCoordinatorId: ctxCoordinatorId
  } = useAppContext();

  const courseName = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const radarData = useMemo(
    () =>
      dimensionsWithGrades.map((d) => ({
        dimension: `Dim. ${d.number}`,
        grade: d.averageGrade
      })),
    [dimensionsWithGrades]
  );

  const router = useRouter();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [currentYearState, setCurrentYearState] = useState<number | null>(
    currentYear
  );
  const [courseCoordinatorId, setCourseCoordinatorId] = useState<string | null>(
    ctxCoordinatorId ?? null
  );
  // Reuse coordinatorId from context promptly
  useEffect(() => {
    if (ctxCoordinatorId !== undefined) {
      setCourseCoordinatorId(ctxCoordinatorId ?? null);
    }
  }, [ctxCoordinatorId]);

  const clientCanCreate = useMemo(() => {
    if (!role) return false;
    if (role === 'ADMIN' || role === UserRole.ADMIN) return true;
    if ((role === 'COORDINATOR' || role === UserRole.COORDINATOR) && userId) {
      return courseCoordinatorId === userId;
    }
    return false;
  }, [role, userId, courseCoordinatorId]);

  // Prefer client calculation when it turns true; otherwise fall back to SSR initial
  const canCreateCycle = clientCanCreate || !!canCreateCycleInitial;

  const {
    availableYears: fetchedYears,
    latestYear,
    loading: yearsLoading,
    error: yearsError
  } = useCourseYears(slug);
  useEffect(() => {
    setAvailableYears(fetchedYears);
    if (latestYear !== null) setCurrentYearState(latestYear);
  }, [fetchedYears, latestYear]);

  const {
    createCycle,
    loading: createLoading,
    error: createError
  } = useCreateCycle(slug);
  useEffect(() => {
    if (createError) {
      toast.error(createError);
    }
  }, [createError]);
  async function handleCreateCycle(year: number, copyFromPrevious: boolean) {
    await createCycle(year, copyFromPrevious);
    toast.success('Ciclo criado com sucesso!');
    setCurrentYearState(year);
    setAvailableYears((prev) => {
      if (prev.includes(year)) return prev;
      const next = [...prev, year];
      next.sort((a, b) => a - b);
      return next;
    });
    const url = new URL(window.location.href);
    url.searchParams.set('year', String(year));
    window.history.replaceState({}, '', url.toString());
    router.refresh();
  }

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">
            Dimensões{' '}
            <span className="text-foreground font-semibold">
              — {courseName}
            </span>
          </h1>
          <p className="text-muted-foreground text-base">
            Acompanhe o desempenho do curso nas 3 dimensões do SINAES.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 hover:cursor-pointer"
          >
            <a
              href="/assets/pdf/manual-instrucoes.pdf"
              download
              aria-label={`Baixar Manual de Instruções}`}
              className="inline-flex items-center gap-2"
            >
              <Download className="mr-2 h-4 w-4" />
              Manual de instruções
            </a>
          </Button>
          {canCreateCycle && (
            <NewCycle
              open={dialogIsOpen}
              onOpenChange={setDialogIsOpen}
              onCreate={handleCreateCycle}
              trigger={
                <Button
                  className="cursor-pointer bg-green-600 hover:bg-green-700"
                  disabled={createLoading}
                >
                  Criar ciclo
                </Button>
              }
            />
          )}
        </div>
      </div>

      {!hasCycles ? (
        <Card>
          <CardContent className="space-y-4 py-12 text-center">
            <p className="text-lg">
              Este curso ainda não possui ciclos de avaliação.
            </p>
            {canCreateCycle && (
              <NewCycle
                open={dialogIsOpen}
                onOpenChange={setDialogIsOpen}
                onCreate={handleCreateCycle}
                trigger={
                  <Button className="cursor-pointer bg-green-600 hover:bg-green-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Iniciar Primeiro Ciclo Avaliativo
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm font-bold">
                Selecione o ciclo avaliativo
                {yearsLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              <div className="w-48">
                <CycleYearSelect
                  years={availableYears}
                  value={currentYearState}
                  placeholder="Ano do ciclo"
                  updateQueryParam={false}
                  disabled={yearsLoading || availableYears.length === 0}
                  onChange={(yr) => {
                    setCurrentYearState(yr);
                    const url = new URL(window.location.href);
                    url.searchParams.set('year', String(yr));
                    window.history.replaceState({}, '', url.toString());
                    router.refresh();
                  }}
                />
                {yearsError && (
                  <div className="text-destructive mt-1 text-xs">
                    {yearsError}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {dimensionsWithGrades.map((dim) => (
              <DimensionItem
                key={dim.id}
                slug={slug}
                dimensionWithGrade={dim}
                currentYear={currentYearState ?? undefined}
              />
            ))}
          </div>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Visão Geral — Notas por Dimensão</CardTitle>
              {role && !isVisitorRole(role) && <ReportButton slug={slug} />}
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} />
                    <Tooltip formatter={(value: number) => value.toFixed(2)} />
                    <Radar
                      name="Nota Média"
                      dataKey="grade"
                      stroke="#16a34a"
                      fill="#16a34a"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DimensionList;
