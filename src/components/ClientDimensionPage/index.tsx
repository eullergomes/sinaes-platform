'use client';

import * as React from 'react';
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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import NewCicle from '@/components/new-cicle';
import { Filter, Loader2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { IndicatorStatus } from '@prisma/client';
import { DimensionApiResponse, IndicatorGrade } from '@/types/dimension-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import StatusBadge from '../status-badge';

const ClientDimensionPage = ({
  slug,
  dimId,
  year
}: {
  slug: string;
  dimId: string;
  year?: string;
}) => {
  const router = useRouter();

  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [apiData, setApiData] = useState<DimensionApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [gradeFilters, setGradeFilters] = useState<Set<string>>(new Set());
  const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set());

  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  const fetchData = useCallback(
    async (yearToSelect?: number) => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/courses/${slug}/dimensions/${dimId}`
        );
        console.log("Indicadores: ", response);
        
        if (!response.ok)
          throw new Error(
            (await response.json()).error || 'Falha ao carregar os dados'
          );

        const result: DimensionApiResponse = await response.json();
        setApiData(result);

        const allYears = new Set(
          result.indicators.flatMap((i) => i.evaluations.map((ev) => ev.year))
        );
        const sortedYears = Array.from(allYears).sort((a, b) => b - a);

        setAvailableYears(sortedYears);

        setSelectedYear((prev) => {
          const next =
            yearToSelect && allYears.has(yearToSelect)
              ? yearToSelect
              : prev !== 0 && allYears.has(prev)
                ? prev
                : sortedYears[0] || 0;
          return prev === next ? prev : next;
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro.');
      } finally {
        setIsLoading(false);
      }
    },
    [slug, dimId]
  );

  useEffect(() => {
    if (slug && dimId) fetchData(year ? parseInt(year, 10) : undefined);
  }, [slug, dimId, year, fetchData]);

  useEffect(() => {
    if (!apiData) return;
    setVisibility((prev) => {
      const next: Record<string, boolean> = { ...prev };
      for (const indicator of apiData.indicators) {
        const evaluation = indicator.evaluations.find(
          (ev) => ev.year === selectedYear
        );
        // checked = exibe dados; padrão segue o nsaApplicable vindo da API (true => exibe)
        const initialVisible = evaluation?.nsaApplicable ?? true;
        if (typeof next[indicator.code] === 'undefined') {
          next[indicator.code] = initialVisible;
        }
      }
      return next;
    });
  }, [apiData, selectedYear]);

  // --- LÓGICA DE FILTRAGEM E MAPEAMENTO ---
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

    return mapped.filter((i) => {
      const gradeOk = gradeFilters.size === 0 || gradeFilters.has(i.grade);
      const statusOk = statusFilters.size === 0 || statusFilters.has(i.status);
      return gradeOk && statusOk;
    });
  }, [apiData, selectedYear, gradeFilters, statusFilters]);

  // --- HANDLERS ---
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

  async function handleCreateCycle(y: number, copyFromPrevious: boolean) {
    const res = await fetch(`/api/courses/${encodeURIComponent(slug)}/cycles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year: y, copyFromPrevious })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || 'Falha ao criar ciclo');
    }
    toast.success('Ciclo criado com sucesso.');
    await fetchData(y);
  }

  const handleEdit = (code: string) => {
    router.push(
      `/courses/${slug}/dimensions/${dimId}/indicators/${code}?year=${selectedYear}`
    );
  };

  const getGradeBadge = (grade: IndicatorGrade) => {
    switch (grade) {
      case IndicatorGrade.G5:
      case IndicatorGrade.G4:
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            {grade.slice(1)}
          </Badge>
        );
      case IndicatorGrade.G3:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            {grade.slice(1)}
          </Badge>
        );
      case IndicatorGrade.G2:
      case IndicatorGrade.G1:
        return <Badge variant="destructive">{grade.slice(1)}</Badge>;
      default:
        return <Badge variant="secondary">NSA</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        <p className="ml-2">Carregando indicadores...</p>
      </div>
    );
  }
  if (error) {
    return <div className="text-destructive p-8 text-center">{error}</div>;
  }
  if (!apiData) {
    return (
      <div className="text-muted-foreground p-8 text-center">
        Nenhum dado encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <Toaster richColors position="top-right" />
      <h1 className="text-3xl font-bold">{apiData?.dimension.title}</h1>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>
            Indicadores da Dimensão {dimId} — Ciclo {selectedYear || 'N/A'}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={String(selectedYear)}
              onValueChange={(v) => setSelectedYear(Number(v))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
              <DropdownMenuContent className="w-40" align="start">
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
                      onCheckedChange={() => toggleInSet(g, setGradeFilters)}
                      className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
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
                      onCheckedChange={() => toggleInSet(s, setStatusFilters)}
                      className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
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
            <NewCicle
              open={dialogIsOpen}
              onOpenChange={setDialogIsOpen}
              onCreate={handleCreateCycle}
              trigger={
                <Button className="bg-green-600 hover:cursor-pointer hover:bg-green-700">
                  Criar ciclo
                </Button>
              }
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Código</th>
                  <th className="border px-4 py-2 text-left">Indicador</th>
                  <th className="border px-4 py-2 text-center">Nota</th>
                  <th className="border px-4 py-2 text-center">Status</th>
                  <th className="border px-4 py-2 text-center">
                    Última Atualização
                  </th>
                  <th className="border px-4 py-2 text-center">Ações</th>
                  <th className="border px-4 py-2 text-center">NSA</th>
                </tr>
              </thead>
              <tbody>
                {processedIndicators.length > 0 ? (
                  processedIndicators.map((indicator) => {
                    const isVisible = visibility[indicator.code] ?? true;
                    return (
                      <tr
                        key={indicator.code}
                        className={
                          !isVisible
                            ? 'text-muted-foreground bg-gray-50'
                            : 'hover:bg-gray-50'
                        }
                      >
                        <td className="border px-4 py-2">{indicator.code}</td>
                        <td className="max-w-xs border px-4 py-2 whitespace-normal">
                          {indicator.name}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {isVisible ? getGradeBadge(indicator.grade) : '—'}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {isVisible ? (
                            <StatusBadge status={indicator.status} />
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {isVisible ? indicator.lastUpdate : '—'}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {indicator.hasEvaluation ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(indicator.code)}
                              disabled={!isVisible}
                              className="hover:cursor-pointer"
                            >
                              Editar
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleEdit(indicator.code)}
                              disabled={!isVisible}
                              className="hover:cursor-pointer"
                            >
                              Registrar
                            </Button>
                          )}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {!indicator.nsaLocked && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Checkbox
                                  checked={isVisible}
                                  disabled={indicator.nsaLocked}
                                  className="hover:cursor-pointer aria-[checked=true]:border-blue-600 aria-[checked=true]:bg-blue-600 aria-[checked=true]:text-white"
                                  onCheckedChange={(val) =>
                                    setVisibility((prev) => ({
                                      ...prev,
                                      [indicator.code]: Boolean(val)
                                    }))
                                  }
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {isVisible ? 'Desativar' : 'Ativar'} Indicador
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="border px-4 py-8 text-center text-gray-500"
                    >
                      Nenhum indicador encontrado com os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDimensionPage;
