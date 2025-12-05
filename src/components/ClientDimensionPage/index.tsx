'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  isVisitor as isVisitorRole,
  canToggleNsaIndicator
} from '@/lib/permissions';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import CycleYearSelect from '@/components/CycleYearSelect';
import { Filter, Loader2 } from 'lucide-react';
import { IndicatorGrade, IndicatorStatus } from '@prisma/client';
import { DimensionApiResponse } from '@/types/dimension-types';
import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import StatusBadge from '../status-badge';
import IndicatorsTable, { IndicatorRow } from './IndicatorsTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { updateNsaStatusBatch } from '@/actions/indicator';
import { useDimensionData } from '@/hooks/useDimensionData';

const ClientDimensionPage = ({
  slug,
  dimId,
  year,
  initialDimension
}: {
  slug: string;
  dimId: string;
  year?: string;
  initialDimension?: DimensionApiResponse;
}) => {
  // Visitor view detection using shared permissions
  const { role } = useAppContext();
  const visitorView = isVisitorRole(role);
  const { userId, courseCoordinatorId } = useAppContext();
  const userCanToggleNsa = canToggleNsaIndicator({
    role,
    userId: userId ?? null,
    courseCoordinatorId
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const [apiData, setApiData] = useState<DimensionApiResponse | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [gradeFilters, setGradeFilters] = useState<Set<string>>(new Set());
  const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set());

  const [nsaStatus, setNsaStatus] = useState<Record<string, boolean>>({});
  const [nsaDiff, setNsaDiff] = useState<
    { indicatorCode: string; nsaApplicable: boolean }[]
  >([]);
  const [savingNsa, setSavingNsa] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    data: dimensionData,
    isLoading,
    isError,
    error,
    isFetching
  } = useDimensionData(slug, dimId, initialDimension);

  useEffect(() => {
    if (!dimensionData) return;
    setApiData(dimensionData);
    const allYears = new Set(
      dimensionData.indicators.flatMap((i) =>
        i.evaluations.map((ev) => ev.year)
      )
    );
    const sortedYears = Array.from(allYears).sort((a, b) => b - a);
    setAvailableYears(sortedYears);
    setSelectedYear((prev) => {
      const requestedYear = year ? parseInt(year, 10) : undefined;
      const next =
        requestedYear && allYears.has(requestedYear)
          ? requestedYear
          : prev !== 0 && allYears.has(prev)
            ? prev
            : sortedYears[0] || 0;
      return prev === next ? prev : next;
    });
  }, [dimensionData, year]);

  useEffect(() => {
    if (!apiData) return;
    const next: Record<string, boolean> = {};
    for (const indicator of apiData.indicators) {
      const evaluation = indicator.evaluations.find(
        (ev) => ev.year === selectedYear
      );
      next[indicator.code] = evaluation?.nsaApplicable ?? true;
    }
    setNsaStatus(next);
  }, [apiData, selectedYear]);

  const processedIndicators = useMemo(() => {
    if (!apiData) return [];

    const mapped = apiData.indicators.map((indicator) => {
      const evaluation = indicator.evaluations.find(
        (ev) => ev.year === selectedYear
      );
      return {
        code: indicator.code,
        name: indicator.name,
        grade: evaluation?.grade ?? IndicatorGrade.NSA,
        status: evaluation?.status ?? IndicatorStatus.NAO_ATINGIDO,
        lastUpdate: evaluation?.lastUpdate
          ? new Date(evaluation.lastUpdate).toLocaleDateString('pt-BR')
          : '—',
        nsaApplicable: evaluation?.nsaApplicable ?? true,
        nsaLocked: evaluation?.nsaLocked ?? false,
        hasEvaluation: !!evaluation
      };
    });

    let filtered = mapped.filter((i) => {
      const gradeOk = gradeFilters.size === 0 || gradeFilters.has(i.grade);
      const statusOk = statusFilters.size === 0 || statusFilters.has(i.status);
      return gradeOk && statusOk;
    });
    // Hide indicators with NSA disabled (nsaApplicable === false) for users without toggle permission
    if (!userCanToggleNsa) {
      filtered = filtered.filter((i) => i.nsaApplicable);
    }
    return filtered;
  }, [apiData, selectedYear, gradeFilters, statusFilters, userCanToggleNsa]);

  const toggleInSet = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>
  ) =>
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });

  const handleEdit = (code: string) => {
    router.push(
      `/courses/${slug}/dimensions/${dimId}/indicators/${code}?year=${selectedYear}`
    );
  };

  if (isLoading && !apiData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        <p className="ml-2">Carregando indicadores...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="text-destructive p-8 text-center">{error?.message}</div>
    );
  }
  if (!apiData) {
    return (
      <div className="text-muted-foreground p-8 text-center">
        Nenhum dado encontrado.
      </div>
    );
  }

  if (apiData && availableYears.length === 0) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <h2 className="text-2xl font-semibold">
          Nenhum ciclo de avaliação encontrado
        </h2>
        <p className="text-muted-foreground max-w-md">
          Para avaliar os indicadores desta dimensão, crie um novo ciclo de
          avaliação do curso.
        </p>
        <Button onClick={() => router.push(`/courses/${slug}/dimensions`)}>
          Criar novo ciclo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-8">
      <h1 className="text-3xl font-bold">{apiData?.dimension.title}</h1>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>
              Indicadores da Dimensão {dimId} — Ciclo {selectedYear || 'N/A'}
            </span>
            {isFetching && (
              <div className="flex items-center gap-2" aria-live="polite">
                <Loader2
                  className="text-muted-foreground h-4 w-4 animate-spin"
                  aria-label="Atualizando"
                />
                <span className="text-muted-foreground text-sm">
                  Atualizando…
                </span>
              </div>
            )}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-2">
            <CycleYearSelect
              years={availableYears}
              value={selectedYear}
              widthClassName="w-28 md:w-32"
              onChange={(y) => setSelectedYear(y)}
              // Atualiza a barra de endereço para refletir ano selecionado
              updateQueryParam={true}
            />
            {!visitorView && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="inline-flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4" /> Nota{' '}
                      {gradeFilters.size > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {gradeFilters.size}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-36" align="start">
                    <DropdownMenuLabel>Filtrar por nota</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.values(IndicatorGrade).map((g) => (
                      <DropdownMenuItem
                        key={g}
                        className="flex items-center gap-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Checkbox
                          id={`grade-${g}`}
                          checked={gradeFilters.has(g)}
                          onCheckedChange={() =>
                            toggleInSet(g, setGradeFilters)
                          }
                        />
                        <Label
                          htmlFor={`grade-${g}`}
                          className="w-full cursor-pointer"
                        >
                          {g === 'NSA' ? 'NSA' : `${g.slice(1)}`}
                        </Label>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="inline-flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4" /> Status{' '}
                      {statusFilters.size > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {statusFilters.size}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-44" align="start">
                    <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.values(IndicatorStatus).map((s) => (
                      <DropdownMenuItem
                        key={s}
                        className="flex items-center gap-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Checkbox
                          id={`status-${s}`}
                          checked={statusFilters.has(s)}
                          onCheckedChange={() =>
                            toggleInSet(s, setStatusFilters)
                          }
                        />
                        <Label
                          htmlFor={`status-${s}`}
                          className="w-full cursor-pointer"
                        >
                          <StatusBadge status={s} />
                        </Label>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            {userCanToggleNsa && nsaDiff.length > 0 && (
              <Button
                variant="secondary"
                className="bg-amber-500 text-white hover:bg-amber-600"
                onClick={() => setShowConfirm(true)}
                disabled={savingNsa}
              >
                {savingNsa ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando
                    NSA...
                  </>
                ) : (
                  `Salvar alterações NSA (${nsaDiff.length})`
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <IndicatorsTable
            data={processedIndicators as IndicatorRow[]}
            nsaStatus={nsaStatus}
            onToggleNsa={(code, val) =>
              setNsaStatus((prev) => ({ ...prev, [code]: val }))
            }
            onDiffChange={(diff) => setNsaDiff(diff)}
            onEdit={handleEdit}
            courseSlug={slug}
            dimensionId={dimId}
            year={selectedYear}
            isVisitor={visitorView}
            showNsaControls={userCanToggleNsa}
          />
        </CardContent>
      </Card>
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar alterações NSA</AlertDialogTitle>
            <AlertDialogDescription>
              Você confirma a alteração do status &quot;Não Se Aplica&quot; para
              os indicadores modificados? Essa ação atualizará imediatamente o
              ciclo {selectedYear}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={savingNsa}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-green-600 hover:bg-green-700"
              disabled={savingNsa}
              onClick={async () => {
                try {
                  setSavingNsa(true);
                  const res = await updateNsaStatusBatch({
                    courseSlug: slug,
                    dimensionId: dimId,
                    evaluationYear: selectedYear,
                    updates: nsaDiff
                  });
                  if (!res.success) {
                    throw new Error(
                      res.error || 'Falha ao salvar alterações NSA.'
                    );
                  }
                  toast.success('Alterações NSA salvas.');
                  setShowConfirm(false);
                  try {
                    await queryClient.invalidateQueries({
                      queryKey: ['dimension', slug, dimId]
                    });
                  } catch {}
                  try {
                    window.dispatchEvent(
                      new CustomEvent('alerts:refresh', {
                        detail: { courseId: slug, year: selectedYear }
                      })
                    );
                  } catch {}
                } catch (e) {
                  toast.error(
                    e instanceof Error
                      ? e.message
                      : 'Erro ao salvar alterações NSA.'
                  );
                } finally {
                  setSavingNsa(false);
                }
              }}
            >
              {savingNsa ? 'Salvando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientDimensionPage;
