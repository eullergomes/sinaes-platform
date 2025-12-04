'use client';

import { useMemo, useState } from 'react';
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
import { useCourseAlerts } from '@/hooks/useCourseAlerts';
import { ApiAlert } from '@/types/alert-types';
import { extractCourseId } from '@/utils/extractCourseId';

const AlertsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const courseId = extractCourseId(pathname);
  const [openDims, setOpenDims] = useState<Set<string>>(new Set());
  const {
    data,
    availableYears,
    selectedYear,
    setSelectedYear,
    loading,
    error,
    fetchAlerts,
    refetch
  } = useCourseAlerts(courseId);

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
    <div className="space-y-8 p-6 md:p-8">
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
              onClick={() => refetch()}
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
