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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

// ====== NSA por dimensão ======
const ALLOWED_NSA_DIM1 = new Set([
  '1.7',
  '1.8',
  '1.9',
  '1.10',
  '1.11',
  '1.14',
  '1.15',
  '1.17',
  '1.18',
  '1.21',
  '1.22',
  '1.23',
  '1.24'
]);
const ALLOWED_NSA_DIM2 = new Set(['2.10', '2.11', '2.14']);
const ALLOWED_NSA_DIM3 = new Set(['3.15', '3.18']);

const NSA_MAP: Record<'1' | '2' | '3', Set<string>> = {
  '1': ALLOWED_NSA_DIM1,
  '2': ALLOWED_NSA_DIM2,
  '3': ALLOWED_NSA_DIM3
};

const MANUAL_BY_DIM: Record<'1' | '2' | '3', string> = {
  '1': '/assets/pdf/pdf-1.pdf',
  '2': '/assets/pdf/pdf-2.pdf',
  '3': '/assets/pdf/pdf-3.pdf'
};

function isAllowedNSA(dimId: '1' | '2' | '3', code: string) {
  return NSA_MAP[dimId].has(code);
}

const DimensionPage = () => {
  const router = useRouter();
  const params = useParams() as { courseId: string; dimensonId: string };

  const dimId = (params.dimensonId as '1' | '2' | '3') ?? '1';
  const courseId = params.courseId;

  const initialYears = React.useMemo(() => [2021, 2024, 2025], []);
  const [years, setYears] = React.useState<number[]>(initialYears);
  const [year, setYear] = React.useState<number>(
    initialYears[initialYears.length - 1] ?? new Date().getFullYear()
  );

  const baseData = React.useMemo(
    () => indicators.filter((i) => i.dimension === dimId),
    [dimId]
  );
  const data = React.useMemo(() => baseData, [baseData]);
  type IndicatorItem = (typeof indicators)[number];

  const [nsaChecked, setNsaChecked] = React.useState<Record<string, boolean>>(
    {}
  );
  React.useEffect(() => {
    const init: Record<string, boolean> = {};
    data.forEach((i) => {
      if (isAllowedNSA(dimId, i.code)) init[i.code] = false;
    });
    setNsaChecked(init);
  }, [dimId, data, year]);

  const [gradeFilters, setGradeFilters] = React.useState<Set<string>>(
    new Set()
  );
  const [statusFilters, setStatusFilters] = React.useState<Set<string>>(
    new Set()
  );

  const gradeOptions = React.useMemo(() => {
    const set = new Set<string>();
    data.forEach((i) => set.add(i.grade));
    const nums = Array.from(set)
      .filter((g) => g !== 'NSA')
      .sort((a, b) => Number(a) - Number(b));
    return set.has('NSA') ? ['NSA', ...nums] : nums;
  }, [data]);

  const statusOptions = React.useMemo<IndicatorItem['status'][]>(() => {
    const set = new Set<IndicatorItem['status']>();
    data.forEach((i) => set.add(i.status));
    return Array.from(set);
  }, [data]);

  const toggleInSet = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>
  ) =>
    setter((prev) => {
      const next = new Set(prev ?? []);
      if (next.has(value)) next.delete(value);
      else next.add(value);
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

  const [newYear, setNewYear] = React.useState<string>('');
  const currentYear = new Date().getFullYear();
  const canCreate = React.useMemo(() => {
    const y = Number(newYear);
    return (
      Number.isInteger(y) &&
      y >= 2000 &&
      y <= currentYear + 10 &&
      !years.includes(y)
    );
  }, [newYear, years, currentYear]);

  const handleCreateCycle = () => {
    const y = Number(newYear);
    if (!Number.isInteger(y)) return;
    if (years.includes(y)) return;
    const next = [...years, y].sort((a, b) => a - b);
    setYears(next);
    setYear(y);
    setNewYear('');
  };

  const handleEdit = (code: string) => {
    router.push(`/courses/${courseId}/dimensions/${dimId}/indicators/${code}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="m-4 text-3xl font-bold md:m-8">{dimTitle}</h1>
      <Card className="m-0 md:m-8">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>
            Indicadores da Dimensão {dimId} — Ciclo {year}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={String(year)}
              onValueChange={(v) => setYear(Number(v))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {years
                  .sort((a, b) => b - a)
                  .map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-transparent bg-green-600 text-white hover:bg-green-700"
                >
                  Criar Novo Ciclo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar novo ciclo</DialogTitle>
                  <DialogDescription>
                    Informe o ano para o novo ciclo de avaliação desta dimensão.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <Label htmlFor="cycle-year">Ano</Label>
                  <Input
                    id="cycle-year"
                    inputMode="numeric"
                    pattern="\\d{4}"
                    placeholder="Ex.: 2027"
                    value={newYear}
                    onChange={(e) =>
                      setNewYear(
                        e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
                      )
                    }
                  />
                </div>
                <DialogFooter>
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogTrigger>
                  {/* Fechar ao criar */}
                  <DialogTrigger asChild>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      disabled={!canCreate}
                      onClick={handleCreateCycle}
                    >
                      Criar ciclo
                    </Button>
                  </DialogTrigger>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="inline-flex items-center gap-2"
                    >
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
                    <Button
                      variant="outline"
                      className="inline-flex items-center gap-2"
                    >
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
                          <StatusBadge status={s} />
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
                    Relatório
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
                  <th className="border px-4 py-2 text-center">
                    Última Atualização
                  </th>
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
                        <div className="flex h-8 items-center">
                          {indicator.code}
                        </div>
                      </td>
                      <td className="max-w-xs border px-4 py-2">
                        <span
                          className="break-words whitespace-normal"
                          title={indicator.name}
                        >
                          {indicator.name}
                        </span>
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <div className="flex h-8 items-center justify-center">
                          {disabledRow ? '—' : indicator.grade}
                        </div>
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <div className="flex h-8 items-center justify-center">
                          {disabledRow ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            <StatusBadge status={indicator.status} />
                          )}
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

export default DimensionPage;
