'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Filter } from 'lucide-react';

type Course = {
  id: string;
  name: string;
  sigla?: string;
  nivel?: 'Tecnólogo' | 'Licenciatura' | 'Bacharelado';
  modalidade?: 'Presencial' | 'EaD' | 'Híbrido';
  'e-mec'?: string;
};

const MOCK_COURSES: Course[] = [
  {
    id: 'ads',
    name: 'Análise e Desenvolvimento de Sistemas',
    sigla: 'ADS',
    nivel: 'Tecnólogo',
    modalidade: 'Presencial',
    'e-mec': 'E-MEC 123456'
  },
  {
    id: 'lic-mat',
    name: 'Licenciatura em Matemática',
    sigla: 'LIC-MAT',
    nivel: 'Licenciatura',
    modalidade: 'Presencial',
    'e-mec': 'E-MEC 987654'
  },
  {
    id: 'eng-civil',
    name: 'Engenharia Civil',
    sigla: 'ENG CIV',
    nivel: 'Bacharelado',
    modalidade: 'Híbrido',
    'e-mec': 'E-MEC 246810'
  },
  {
    id: 'enfermagem',
    name: 'Enfermagem',
    sigla: 'ENF',
    nivel: 'Bacharelado',
    modalidade: 'Presencial',
    'e-mec': 'E-MEC 135791'
  },
  {
    id: 'pedagogia-ead',
    name: 'Pedagogia',
    sigla: 'PED',
    nivel: 'Licenciatura',
    modalidade: 'EaD',
    'e-mec': 'E-MEC 112233'
  }
];

export default function CursosPage() {
  const [query, setQuery] = React.useState('');
  const [modalidadeFilters, setModalidadeFilters] = React.useState<Set<string>>(
    new Set()
  );
  const [nivelFilters, setNivelFilters] = React.useState<Set<string>>(
    new Set()
  );

  const modalidadeOptions = React.useMemo(
    () => ['Presencial', 'EaD', 'Híbrido'],
    []
  );
  const nivelOptions = React.useMemo(
    () => ['Tecnólogo', 'Licenciatura', 'Bacharelado'],
    []
  );

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

  // TODO: trocar MOCK_COURSES por dados da API
  const courses = React.useMemo(() => {
    let data = [...MOCK_COURSES];

    // filtro por texto (nome/sigla)
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.sigla?.toLowerCase().includes(q) ?? false)
      );
    }

    // filtro por modalidade (multi)
    if (modalidadeFilters.size > 0) {
      data = data.filter((c) =>
        c.modalidade ? modalidadeFilters.has(c.modalidade) : false
      );
    }

    // filtro por nível (multi)
    if (nivelFilters.size > 0) {
      data = data.filter((c) => (c.nivel ? nivelFilters.has(c.nivel) : false));
    }

    return data;
  }, [query, modalidadeFilters, nivelFilters]);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-green-600 px-4 text-white md:px-8">
        <Image
          src="/assets/ifma-avalia-logo.png"
          alt="IFMA Avalia Logo"
          width={24}
          height={24}
          className="brightness-0 invert"
        />
        <span className="text-lg font-semibold">IFMA Avalia</span>
      </header>

      <div className="space-y-6 p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Selecionar Curso</h1>
          <p className="text-muted-foreground text-sm">
            Escolha um curso do IFMA Campus Caxias para gerenciar os dados
            avaliativos do SINAES.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nome ou sigla (ex.: ADS, Matemática...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Filtro: Modalidade (mesmo design da Dimensão) */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="inline-flex items-center gap-2 hover:cursor-pointer"
                  >
                    <Filter className="h-4 w-4" />
                    Modalidade
                    {modalidadeFilters.size > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {modalidadeFilters.size}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filtrar por modalidade</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>Filtrar por modalidade</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {modalidadeOptions.map((opt) => {
                const checked = modalidadeFilters.has(opt);
                const id = `modalidade-${opt}`;
                return (
                  <DropdownMenuItem
                    key={opt}
                    className="flex items-center gap-2 hover:bg-gray-100"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={() =>
                        toggleInSet(opt, setModalidadeFilters)
                      }
                    />
                    <Label
                      htmlFor={id}
                      className="w-full cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleInSet(opt, setModalidadeFilters);
                      }}
                    >
                      {opt}
                    </Label>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filtro: Nível (mesmo design da Dimensão) */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="inline-flex items-center gap-2 hover:cursor-pointer"
                  >
                    <Filter className="h-4 w-4" />
                    Nível
                    {nivelFilters.size > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {nivelFilters.size}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filtrar por nível</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>Filtrar por nível</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {nivelOptions.map((opt) => {
                const checked = nivelFilters.has(opt);
                const id = `nivel-${opt}`;
                return (
                  <DropdownMenuItem
                    key={opt}
                    className="flex items-center gap-2 hover:bg-gray-100"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={() => toggleInSet(opt, setNivelFilters)}
                    />
                    <Label
                      htmlFor={id}
                      className="w-full cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleInSet(opt, setNivelFilters);
                      }}
                    >
                      {opt}
                    </Label>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {courses.length === 0 ? (
          <Card>
            <CardContent className="text-muted-foreground py-10 text-center">
              Nenhum curso encontrado.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((c) => (
              <Card key={c.id} className="flex flex-col">
                <CardHeader>
                  {c['e-mec'] && (
                    <div className="mb-1">
                      <Badge className="bg-red-600 text-white hover:bg-green-700">
                        {c['e-mec']}
                      </Badge>
                    </div>
                  )}
                  <CardTitle className="text-lg">
                    {c.name}{' '}
                    {c.sigla ? (
                      <span className="text-muted-foreground">({c.sigla})</span>
                    ) : null}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4">
                  <div className="text-muted-foreground space-y-1 text-sm">
                    {c.nivel && <p>• Nível: {c.nivel}</p>}
                    {c.modalidade && <p>• Modalidade: {c.modalidade}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      href={`/courses/${c.id}`}
                      className="text-primary underline"
                    >
                      Abrir dashboard
                    </Link>
                    <Button asChild className="bg-green-600 hover:bg-green-700">
                      <Link href={`/courses/${c.id}/dimensions`}>
                        Ir para dimensões
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
