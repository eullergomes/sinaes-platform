'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, Loader2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import StatusBadge from '@/components/status-badge';
import { IndicatorStatus } from '@prisma/client';

type ApiAlert = {
  dimensionId: number;
  dimensionLabel: string;
  code: string;
  name: string;
  status: IndicatorStatus;
  lastUpdate: string | null;
  year: number;
};

type ApiResponseSingleYear = {
  course: { id: string; slug: string; name: string };
  availableYears: number[];
  year: number;
  alerts: ApiAlert[];
};

function isSingleYear(res: unknown): res is ApiResponseSingleYear {
  return !!res && typeof res === 'object' && 'alerts' in res && 'year' in res;
}

function extractCourseId(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  const i = parts.indexOf('courses');
  if (i >= 0 && parts[i + 1]) return decodeURIComponent(parts[i + 1]);
  return null;
}

const AlertsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const courseId = extractCourseId(pathname);
  const [openDims, setOpenDims] = useState<Set<string>>(new Set());
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );
  const [data, setData] = useState<ApiAlert[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const fetchAlerts = async (year?: number) => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const url = year
        ? `/api/courses/${courseId}/alerts?year=${year}`
        : `/api/courses/${courseId}/alerts`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(
          (await res.json()).error || 'Falha ao carregar alertas'
        );
      }
      const json = await res.json();
      if (isSingleYear(json)) {
        setAvailableYears(json.availableYears);
        setData(json.alerts);
        setSelectedYear(json.year);
      } else {
        const years = json.availableYears as number[];
        setAvailableYears(years);
        const y = year ?? years[0];
        const all: ApiAlert[] = [];
        if (json.alertsByYear) {
          Object.keys(json.alertsByYear).forEach((k) => {
            const arr = json.alertsByYear[k] as ApiAlert[];
            all.push(...arr);
          });
        }
        setData(all.filter((a) => a.year === y));
        setSelectedYear(y);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchAlerts(selectedYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, refetchIndex]);

  const grouped = useMemo(() => {
    const groups = data.reduce(
      (acc, a) => {
        const key = String(a.dimensionId);
        if (!acc[key]) {
          acc[key] = {
            label: a.dimensionLabel || `Dimensão ${a.dimensionId}`,
            items: [] as ApiAlert[]
          };
        }
        acc[key].items.push(a);
        return acc;
      },
      {} as Record<string, { label: string; items: ApiAlert[] }>
    );
    return Object.fromEntries(
      Object.entries(groups).sort((a, b) => Number(a[0]) - Number(b[0]))
    );
  }, [data]);

  const buildUrl = (a: { dimensionId: number; code: string }) => {
    if (!courseId) return '/courses';
    return `/courses/${courseId}/dimensions/${a.dimensionId}/indicators/${a.code}?year=${selectedYear ?? ''}`;
  };

  const toggleDim = (dimId: string, open: boolean) => {
    setOpenDims((prev) => {
      const next = new Set(prev);
      if (open) next.add(dimId);
      else next.delete(dimId);
      return next;
    });
  };

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">Pendências e Alertas</h1>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="flex items-center gap-3">
            Lista de Pendências
            {loading && (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            )}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={selectedYear ? String(selectedYear) : undefined}
              onValueChange={(v) => {
                const y = parseInt(v, 10);
                setSelectedYear(y);
                fetchAlerts(y);
              }}
              disabled={loading || availableYears.length === 0}
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((y) => (
                  <SelectItem
                    key={y}
                    value={String(y)}
                    className="cursor-pointer"
                  >
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setRefetchIndex((i) => i + 1)}
              disabled={loading}
              aria-label="Recarregar"
              className="cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-destructive mb-4 text-sm">{error}</div>
          )}
          {!error && data.length === 0 && !loading && (
            <p className="text-muted-foreground text-sm">
              Nenhuma pendência encontrada para o ano selecionado.
            </p>
          )}
          <div className="space-y-3">
            {Object.entries(grouped).map(([dimId, group]) => {
              const isOpen = openDims.has(dimId);
              return (
                <Collapsible
                  key={dimId}
                  open={isOpen}
                  onOpenChange={(o) => toggleDim(dimId, o)}
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between rounded-md border p-3 hover:cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{group.label}</span>
                        <Badge
                          variant="destructive"
                          className="h-5 min-w-5 rounded-full bg-red-500 px-1 font-mono tabular-nums"
                        >
                          {group.items.length}
                        </Badge>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 space-y-2 pl-4">
                      {group.items.map((a) => {
                        const url = buildUrl(a);
                        return (
                          <div
                            key={`${a.dimensionId}-${a.code}`}
                            className="flex items-center justify-between rounded-md border p-3 hover:cursor-pointer hover:bg-gray-50"
                            onClick={() => router.push(url)}
                          >
                            <div className="flex flex-col gap-1">
                              <div className="text-sm font-medium">
                                Indicador {a.code}
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {a.name}
                              </div>
                              <div className="text-muted-foreground flex items-center gap-2 text-[11px]">
                                <StatusBadge status={a.status} />
                                {a.lastUpdate && (
                                  <span>
                                    Atualizado{' '}
                                    {new Date(a.lastUpdate).toLocaleDateString(
                                      'pt-BR'
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <Button
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(url);
                                }}
                                className="cursor-pointer"
                              >
                                <ArrowRight size={16} />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsPage;
