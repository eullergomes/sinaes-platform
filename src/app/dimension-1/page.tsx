'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/StatusBadge';
import DownloadIcon from '@/icons/DownloadIcon';
import { Filter } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const indicators = [
  {
    code: '1.1',
    name: 'Políticas institucionais no âmbito do curso',
    grade: '3',
    status: 'Concluído',
    lastUpdate: '2025-06-01'
  },
  {
    code: '1.2',
    name: 'Objetivos do curso',
    grade: '4',
    status: 'Em revisão',
    lastUpdate: '2025-05-28'
  },
  {
    code: '1.3',
    name: 'Perfil profissional do egresso',
    grade: '3',
    status: 'Pendente',
    lastUpdate: '2025-05-20'
  },
  {
    code: '1.4',
    name: 'Estrutura curricular',
    grade: 'NSA',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '1.5',
    name: 'Conteúdos curriculares',
    grade: '5',
    status: 'Concluído',
    lastUpdate: '2025-05-30'
  },
  {
    code: '1.6',
    name: 'Metodologia',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.7',
    name: 'Estágio curricular supervisionado',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.8',
    name: 'Estágio curricular supervisionado – relação com a rede de escolas da educação básica',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.9',
    name: 'Estágio curricular supervisionado – relação teoria e prática',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.10',
    name: 'Atividades complementares',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.11',
    name: 'Trabalhos de Conclusão de Curso (TCC)',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.12',
    name: 'Apoio ao discente',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.13',
    name: 'Gestão do curso e os processos de avaliação interna e externa',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.14',
    name: 'Atividades de tutoria',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.15',
    name: 'Conhecimentos, habilidades e atitudes necessárias às atividades de tutoria',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.16',
    name: 'Tecnologias de Informação e comunicação (TIC) no processo ensino-aprendizagem',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.17',
    name: 'Ambiente Virtual de Aprendizagem (AVA)',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.18',
    name: 'Material didático',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.19',
    name: 'Procedimentos de acompanhamento e de avaliação dos processos de ensino-aprendizagem',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.20',
    name: 'Número de vagas',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.21',
    name: 'Integração com as redes públicas de ensino',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.22',
    name: 'Integração do curso com o sistema local e regional de saúde (SUS)',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.23',
    name: 'Atividades práticas de ensino para áreas da saúde',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.24',
    name: 'Atividades práticas de ensino para licenciaturas',
    grade: 'NSA',
    status: 'Pendente',
    lastUpdate: '-'
  }
];

const ALLOWED_NSA = new Set([
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

const Dimension1Page = () => {
  const router = useRouter();

  const [nsaChecked, setNsaChecked] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    indicators.forEach((i) => {
      if (ALLOWED_NSA.has(i.code)) init[i.code] = false;
    });
    return init;
  });

  const handleEdit = (code: string) => {
    router.push(`/dimension-1/indicator/${code}`);
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
      <h1 className="text-3xl font-bold">
        Dimensão 1 - Organização Didático-Pedagógica
      </h1>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Indicadores da Dimensão 1</CardTitle>

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

export default Dimension1Page;
