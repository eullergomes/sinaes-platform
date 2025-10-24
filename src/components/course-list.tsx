'use client';

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState
} from 'react';
import { CourseModality, CourseLevel } from '@prisma/client';
import { Course } from '@prisma/client';
import { Button } from './ui/button';
import Link from 'next/link';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Filter } from 'lucide-react';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import CourseItem from './course-item';
import { toast } from 'sonner';
import { useSearchParams, useRouter } from 'next/navigation';

type CourseWithCoordinator = Course & {
  coordinator?: { id: string; name: string } | null;
};

const CourseList = ({
  initialCourses
}: {
  initialCourses: CourseWithCoordinator[];
}) => {
  const [query, setQuery] = useState('');
  const [modalidadeFilters, setModalidadeFilters] = useState<Set<string>>(
    new Set()
  );
  const [nivelFilters, setNivelFilters] = useState<Set<string>>(new Set());
  const searchParams = useSearchParams();
  const router = useRouter();

  const modalidadeOptions = useMemo(() => Object.values(CourseModality), []);
  const nivelOptions = useMemo(() => Object.values(CourseLevel), []);

  const toggleInSet = (
    value: string,
    setter: Dispatch<SetStateAction<Set<string>>>
  ) =>
    setter((prev) => {
      const next = new Set(prev ?? []);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });

  const filteredCourses = useMemo(() => {
    let data = [...initialCourses];
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
      );
    }
    if (modalidadeFilters.size > 0) {
      data = data.filter(
        (c) => c.modality && modalidadeFilters.has(c.modality)
      );
    }
    if (nivelFilters.size > 0) {
      data = data.filter((c) => c.level && nivelFilters.has(c.level));
    }
    return data;
  }, [query, modalidadeFilters, nivelFilters, initialCourses]);

  useEffect(() => {
    const created = searchParams.get('created');
    const updated = searchParams.get('updated');
    const e = searchParams.get('e');
    const show =
      created === '1' ? 'created' : updated === '1' ? 'updated' : undefined;
    if (show) {
      const key = e ? `toast_shown_${e}` : undefined;
      if (!key || !sessionStorage.getItem(key)) {
        toast.success(
          show === 'created'
            ? 'Curso criado com sucesso!'
            : 'Curso atualizado com sucesso!'
        );
        if (key) sessionStorage.setItem(key, '1');
      }
      const sp = new URLSearchParams(Array.from(searchParams.entries()));
      if (created) sp.delete('created');
      if (updated) sp.delete('updated');
      if (e) sp.delete('e');
      router.replace(`/courses${sp.toString() ? `?${sp.toString()}` : ''}`);
    }
  }, [searchParams, router]);

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Selecionar Curso</h1>
          <p className="text-muted-foreground text-sm">
            Escolha um curso do IFMA Campus Caxias para gerenciar os dados
            avaliativos do SINAES.
          </p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/courses/new">Criar curso</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nome ou sigla (ex.: ADS, eng-civil...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

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
            {modalidadeOptions.map((opt) => (
              <DropdownMenuItem
                key={opt}
                className="flex items-center gap-2 hover:bg-gray-100"
                onSelect={(e) => e.preventDefault()}
              >
                <Checkbox
                  id={`modalidade-${opt}`}
                  checked={modalidadeFilters.has(opt)}
                  onCheckedChange={() => toggleInSet(opt, setModalidadeFilters)}
                />
                <Label
                  htmlFor={`modalidade-${opt}`}
                  className="w-full cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleInSet(opt, setModalidadeFilters);
                  }}
                >
                  {opt}
                </Label>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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
            {nivelOptions.map((opt) => (
              <DropdownMenuItem
                key={opt}
                className="flex items-center gap-2 hover:bg-gray-100"
                onSelect={(e) => e.preventDefault()}
              >
                <Checkbox
                  id={`nivel-${opt}`}
                  checked={nivelFilters.has(opt)}
                  onCheckedChange={() => toggleInSet(opt, setNivelFilters)}
                />
                <Label
                  htmlFor={`nivel-${opt}`}
                  className="w-full cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleInSet(opt, setNivelFilters);
                  }}
                >
                  {opt}
                </Label>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground py-10 text-center">
            Nenhum curso encontrado.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseItem key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
