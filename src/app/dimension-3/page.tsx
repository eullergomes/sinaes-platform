'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import DownloadIcon from '@/icons/DownloadIcon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const indicators = [
  {
    code: '3.1',
    name: 'Espaço de trabalho para docentes em tempo integral',
    grade: '4',
    status: 'Concluído',
    lastUpdate: '2025-05-28'
  },
  {
    code: '3.2',
    name: 'Espaço de trabalho para o coordenador',
    grade: '5',
    status: 'Concluído',
    lastUpdate: '2025-05-29'
  },
  {
    code: '3.3',
    name: 'Sala coletiva de professores',
    grade: '3',
    status: 'Em revisão',
    lastUpdate: '2025-05-30'
  },
  {
    code: '3.4',
    name: 'Salas de aula',
    grade: '2',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '3.5',
    name: 'Acesso dos alunos a equipamentos de informática',
    grade: 'NSA',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '3.6',
    name: 'Bibliografia básica por Unidade Curricular (UC)',
    grade: '4',
    status: 'Concluído',
    lastUpdate: '2025-05-27'
  },
  {
    code: '3.7',
    name: 'Bibliografia complementar por Unidade Curricular (UC)',
    grade: '5',
    status: 'Concluído',
    lastUpdate: '2025-06-01'
  },
  {
    code: '3.8',
    name: 'Laboratórios didáticos de formação básica',
    grade: '3',
    status: 'Em revisão',
    lastUpdate: '2025-05-25'
  },
  {
    code: '3.9',
    name: 'Laboratórios didáticos de formação específica',
    grade: 'NSA',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '3.10',
    name: 'Laboratórios de ensino para a área de saúde',
    grade: '4',
    status: 'Concluído',
    lastUpdate: '2025-06-02'
  },
  {
    code: '3.11',
    name: 'Laboratórios de habilidades',
    grade: '2',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '3.12',
    name: 'Unidades hospitalares e complexo assistencial conveniados',
    grade: '5',
    status: 'Concluído',
    lastUpdate: '2025-06-03'
  },
  {
    code: '3.13',
    name: 'Biotérios',
    grade: '3',
    status: 'Em revisão',
    lastUpdate: '2025-05-26'
  },
  {
    code: '3.14',
    name: 'Processo de controle de produção ou distribuição de material didático (logística)',
    grade: '4',
    status: 'Concluído',
    lastUpdate: '2025-05-31'
  },
  {
    code: '3.15',
    name: 'Núcleo de práticas jurídicas: atividades básicas e arbitragem, negociação, conciliação, mediação e atividades jurídicas reais',
    grade: 'NSA',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '3.16',
    name: 'Comitê de Ética em Pesquisa (CEP)',
    grade: '3',
    status: 'Em revisão',
    lastUpdate: '2025-05-29'
  },
  {
    code: '3.17',
    name: 'Comitê de Ética na Utilização de Animais (CEUA)',
    grade: '4',
    status: 'Concluído',
    lastUpdate: '2025-06-01'
  },
  {
    code: '3.18',
    name: 'Ambientes profissionais vinculados ao curso',
    grade: 'NSA',
    status: 'Pendente',
    lastUpdate: '-'
  }
];

const ALLOWED_NSA = new Set([
  '3.3',
  '3.4',
  '3.8',
  '3.9',
  '3.10',
  '3.11',
  '3.12',
  '3.13',
  '3.14',
  '3.15',
  '3.16',
  '3.17',
  '3.18'
]);

const Dimension3Page = () => {
  const router = useRouter();

  const [nsaChecked, setNsaChecked] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    indicators.forEach((i) => {
      if (ALLOWED_NSA.has(i.code)) init[i.code] = false;
    });
    return init;
  });

  const handleEdit = (code: string) => {
    router.push(`/dimension-3/indicator/${code}`);
  };

  const [gradeFilters, setGradeFilters] = useState<Set<string>>(new Set());
  const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set());

  const gradeOptions = useMemo(() => {
    const set = new Set<string>();
    indicators.forEach((i) => set.add(i.grade));
    const nums = Array.from(set)
      .filter((g) => g !== 'NSA')
      .sort((a, b) => Number(a) - Number(b));
    return set.has('NSA') ? ['NSA', ...nums] : nums;
  }, []);

  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    indicators.forEach((i) => set.add(i.status));
    return Array.from(set);
  }, []);

  const toggleInSet = (value: string, setter: (s: Set<string>) => void) =>
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });

  // const clearFilters = () => {
  //   setGradeFilters(new Set());
  //   setStatusFilters(new Set());
  // };

  // const hasActiveFilters = gradeFilters.size > 0 || statusFilters.size > 0;

  const filteredIndicators = useMemo(() => {
    return indicators.filter((i) => {
      const gradeOk = gradeFilters.size ? gradeFilters.has(i.grade) : true;
      const statusOk = statusFilters.size ? statusFilters.has(i.status) : true;
      return gradeOk && statusOk;
    });
  }, [gradeFilters, statusFilters]);

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">Dimensão 3 - Infraestrutura</h1>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Indicadores da Dimensão 3</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="inline-flex cursor-pointer items-center gap-2"
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
                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
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
                      className="inline-flex cursor-pointer items-center gap-2"
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

              <DropdownMenuContent className="w-48" align="start">
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
                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
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

            {/* {hasActiveFilters && (
              <Button
                variant="destructive"
                className="inline-flex cursor-pointer items-center gap-1"
                onClick={clearFilters}
              >
                <Trash2 />
              </Button>
            )} */}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="outline"
                  className="ml-auto cursor-pointer"
                >
                  <a
                    href="/assets/pdf/pdf-1.pdf"
                    download
                    aria-label="Baixar Manual de Instruções da Dimensão 1"
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
                  <th className="border px-4 py-2 text-center">
                    Última Atualização
                  </th>
                  <th className="border px-4 py-2 text-center">Ações</th>
                  <th className="border px-4 py-2 text-center">NSA</th>
                </tr>
              </thead>
              <tbody>
                {filteredIndicators.map((indicator) => {
                  const isAllowed = ALLOWED_NSA.has(indicator.code);
                  const checked = !!nsaChecked[indicator.code];
                  const isDisabled = isAllowed && !checked;

                  return (
                    <tr key={indicator.code} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">
                        <div className="flex h-8 items-center justify-start">
                          {indicator.code}
                        </div>
                      </td>

                      <td className="border px-4 py-2">
                        <div className="flex h-8 items-center justify-start">
                          {indicator.name}
                        </div>
                      </td>

                      <td className="border px-4 py-2 text-center">
                        <div className="flex h-8 items-center justify-center">
                          {isDisabled ? '—' : indicator.grade}
                        </div>
                      </td>

                      <td className="border px-4 py-2 text-center">
                        <div className="flex h-8 items-center justify-center">
                          {isDisabled ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            <StatusBadge status={indicator.status} />
                          )}
                        </div>
                      </td>

                      <td className="border px-4 py-2 text-center">
                        <div className="flex h-8 items-center justify-center">
                          {isDisabled ? '—' : indicator.lastUpdate}
                        </div>
                      </td>

                      <td className="border px-4 py-2 text-center">
                        <div className="flex h-8 items-center justify-center">
                          {isDisabled ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            <Button
                              className="cursor-pointer"
                              variant="outline"
                              onClick={() => handleEdit(indicator.code)}
                              disabled={isAllowed ? !checked : false}
                            >
                              Editar
                            </Button>
                          )}
                        </div>
                      </td>

                      <td className="border px-4 py-2 text-center">
                        <div className="flex h-8 items-center justify-center">
                          {isAllowed ? (
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

export default Dimension3Page;
