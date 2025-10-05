'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { Filter } from 'lucide-react';
import DownloadIcon from '@/icons/DownloadIcon';
import StatusBadge from '@/components/StatusBadge';

import { indicators } from '@/app/constants/indicators';
import { DIMENSIONS } from '@/app/constants/dimensions';

// ====== NSA por dimensão ======
const ALLOWED_NSA_DIM1 = new Set(['1.7','1.8','1.9','1.10','1.11','1.14','1.15','1.17','1.18','1.21','1.22','1.23','1.24']);
const ALLOWED_NSA_DIM2 = new Set(['2.10','2.11','2.14']);
const ALLOWED_NSA_DIM3 = new Set(['3.15','3.18']);

const NSA_MAP: Record<'1'|'2'|'3', Set<string>> = {
  '1': ALLOWED_NSA_DIM1,
  '2': ALLOWED_NSA_DIM2,
  '3': ALLOWED_NSA_DIM3
};

const MANUAL_BY_DIM: Record<'1'|'2'|'3', string> = {
  '1': '/assets/pdf/pdf-1.pdf',
  '2': '/assets/pdf/pdf-2.pdf',
  '3': '/assets/pdf/pdf-3.pdf'
};

function isAllowedNSA(dimId: '1'|'2'|'3', code: string) {
  return NSA_MAP[dimId].has(code);
}

const DimensionPage = () => {
  const router = useRouter();
  const params = useParams() as { courseId: string; dimensonId: string };

  const dimId = (params.dimensonId as '1' | '2' | '3') ?? '1';
  const courseId = params.courseId;

  const data = React.useMemo(
    () => indicators.filter((i) => i.dimension === dimId),
    [dimId]
  );

  const [nsaChecked, setNsaChecked] = React.useState<Record<string, boolean>>({});
  React.useEffect(() => {
    const init: Record<string, boolean> = {};
    data.forEach((i) => {
      if (isAllowedNSA(dimId, i.code)) init[i.code] = false;
    });
    setNsaChecked(init);
  }, [dimId, data]);

  const [gradeFilters, setGradeFilters] = React.useState<Set<string>>(new Set());
  const [statusFilters, setStatusFilters] = React.useState<Set<string>>(new Set());

  const gradeOptions = React.useMemo(() => {
    const set = new Set<string>();
    data.forEach((i) => set.add(i.grade));
    const nums = Array.from(set).filter((g) => g !== 'NSA').sort((a, b) => Number(a) - Number(b));
    return set.has('NSA') ? ['NSA', ...nums] : nums;
  }, [data]);

  const statusOptions = React.useMemo(() => {
    const set = new Set<string>();
    data.forEach((i) => set.add(i.status));
    return Array.from(set);
  }, [data]);

  const toggleInSet = (value: string, setter: (s: Set<string>) => void) =>
    setter((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });

  const filteredIndicators = React.useMemo(() => {
    return data.filter((i) => {
      const gradeOk = gradeFilters.size ? gradeFilters.has(i.grade) : true;
      const statusOk = statusFilters.size ? statusFilters.has(i.status) : true;
      return gradeOk && statusOk;
    });
  }, [data, gradeFilters, statusFilters]);

  const dimTitle = `Dimensão ${dimId} — ${DIMENSIONS[dimId].title}`;

  const handleEdit = (code: string) => {
    router.push(`/courses/${courseId}/dimensions/${dimId}/indicators/${code}`);
  };

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">{dimTitle}</h1>
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Indicadores da Dimensão {dimId}</CardTitle>

          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="inline-flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Nota atual
                      {gradeFilters.size > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {gradeFilters.size}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filtrar por nota</p>
                </TooltipContent>
              </Tooltip>

              <DropdownMenuContent className="w-48" align="start">
                <DropdownMenuLabel>Filtrar por nota</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {gradeOptions.map((g) => {
                  const checked = gradeFilters.has(g);
                  const id = `grade-${g}`;
                  return (
                    <DropdownMenuItem
                      key={g}
                      className="flex items-center gap-2 hover:bg-gray-100"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Checkbox
                        id={id}
                        checked={checked}
                        onCheckedChange={() => toggleInSet(g, setGradeFilters)}
                      />
                      <Label
                        htmlFor={id}
                        className="w-full cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleInSet(g, setGradeFilters);
                        }}
                      >
                        {g}
                      </Label>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="inline-flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Status
                      {statusFilters.size > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {statusFilters.size}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filtrar por status</p>
                </TooltipContent>
              </Tooltip>

              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusOptions.map((s) => {
                  const checked = statusFilters.has(s);
                  const id = `status-${s}`;
                  return (
                    <DropdownMenuItem
                      key={s}
                      className="flex items-center gap-2 hover:bg-gray-100"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Checkbox
                        id={id}
                        checked={checked}
                        onCheckedChange={() => toggleInSet(s, setStatusFilters)}
                      />
                      <Label
                        htmlFor={id}
                        className="w-full cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleInSet(s, setStatusFilters);
                        }}
                      >
                        <div className="flex items-center">
                          <StatusBadge status={s as any} />
                        </div>
                      </Label>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="outline" className="ml-auto">
                  <a
                    href={MANUAL_BY_DIM[dimId]}
                    download
                    aria-label={`Baixar Manual de Instruções da Dimensão ${dimId}`}
                    className="inline-flex items-center gap-2"
                  >
                    <DownloadIcon width={16} height={16} />
                    Manual de Instruções
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Baixar manual de instruções</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Código</th>
                  <th className="border px-4 py-2 text-left">Indicador</th>
                  <th className="border px-4 py-2 text-center">Nota atual</th>
                  <th className="border px-4 py-2 text-center">Status</th>
                  <th className="border px-4 py-2 text-center">Última Atualização</th>
                  <th className="border px-4 py-2 text-center">Ações</th>
                  <th className="border px-4 py-2 text-center">NSA</th>
                </tr>
              </thead>

              <tbody>
                {filteredIndicators.map((indicator) => {
                  const allowed = isAllowedNSA(dimId, indicator.code);
                  const checked = !!nsaChecked[indicator.code];
                  const disabledRow = allowed && !checked;

                  return (
                    <tr key={indicator.code} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">
                        <div className="flex h-8 items-center">{indicator.code}</div>
                      </td>
                      <td className="border px-4 py-2">
                        <div className="flex h-8 items-center">{indicator.name}</div>
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <div className="flex h-8 items-center justify-center">
                          {disabledRow ? '—' : indicator.grade}
                        </div>
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <div className="flex h-8 items-center justify-center">
                          {disabledRow ? <span className="text-gray-400">—</span> : <StatusBadge status={indicator.status as any} />}
                        </div>
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <div className="flex h-8 items-center justify-center">
                          {disabledRow ? '—' : indicator.lastUpdate}
                        </div>
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <div className="flex h-8 items-center justify-center">
                          {disabledRow ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            <Button
                              className="cursor-pointer"
                              variant="outline"
                              onClick={() => handleEdit(indicator.code)}
                              disabled={allowed ? !checked : false}
                            >
                              Editar
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <div className="flex h-8 items-center justify-center">
                          {allowed ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={() =>
                                    setNsaChecked((prev) => ({
                                      ...prev,
                                      [indicator.code]: !prev[indicator.code]
                                    }))
                                  }
                                  aria-label={`Marcar NSA ${indicator.code}`}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                {checked ? 'Desativar' : 'Ativar'}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredIndicators.length === 0 && (
                  <tr>
                    <td colSpan={7} className="border px-4 py-8 text-center text-gray-500">
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

export default DimensionPage;
