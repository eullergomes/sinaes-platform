'use client';

import * as React from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Course = {
  id: string;
  name: string;
  sigla?: string;
  nivel?: 'Tecnólogo' | 'Licenciatura' | 'Bacharelado';
  modalidade?: 'Presencial' | 'EaD' | 'Híbrido';
};

const MOCK_COURSES: Course[] = [
  { id: 'ads', name: 'Análise e Desenvolvimento de Sistemas', sigla: 'ADS', nivel: 'Tecnólogo', modalidade: 'Presencial' },
  { id: 'lic-mat', name: 'Licenciatura em Matemática', sigla: 'LIC-MAT', nivel: 'Licenciatura', modalidade: 'Presencial' },
  { id: 'eng-civil', name: 'Engenharia Civil', sigla: 'ENG CIV', nivel: 'Bacharelado', modalidade: 'Híbrido' },
  { id: 'enfermagem', name: 'Enfermagem', sigla: 'ENF', nivel: 'Bacharelado', modalidade: 'Presencial' },
  { id: 'pedagogia-ead', name: 'Pedagogia', sigla: 'PED', nivel: 'Licenciatura', modalidade: 'EaD' },
];

export default function CursosPage() {
  const [query, setQuery] = React.useState('');
  const [modalidade, setModalidade] = React.useState<'todas' | 'Presencial' | 'EaD' | 'Híbrido'>('todas');
  const [nivel, setNivel] = React.useState<'todos' | 'Tecnólogo' | 'Licenciatura' | 'Bacharelado'>('todos');

  // TODO: trocar MOCK_COURSES por dados da API
  const courses = React.useMemo(() => {
    let data = [...MOCK_COURSES];

    // filtro por texto (nome/sigla)
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.sigla?.toLowerCase().includes(q) ?? false)
      );
    }

    // filtro por modalidade
    if (modalidade !== 'todas') {
      data = data.filter(c => c.modalidade === modalidade);
    }

    // filtro por nível
    if (nivel !== 'todos') {
      data = data.filter(c => c.nivel === nivel);
    }

    return data;
  }, [query, modalidade, nivel]);

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Selecionar Curso</h1>
        <p className="text-sm text-muted-foreground">
          Escolha um curso do IFMA Campus Caxias para gerenciar os dados avaliativos do SINAES.
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

        <Select value={modalidade} onValueChange={(v: typeof modalidade) => setModalidade(v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Modalidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="Presencial">Presencial</SelectItem>
            <SelectItem value="EaD">EaD</SelectItem>
            <SelectItem value="Híbrido">Híbrido</SelectItem>
          </SelectContent>
        </Select>

        <Select value={nivel} onValueChange={(v: typeof nivel) => setNivel(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="Tecnólogo">Tecnólogo</SelectItem>
            <SelectItem value="Licenciatura">Licenciatura</SelectItem>
            <SelectItem value="Bacharelado">Bacharelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Nenhum curso encontrado.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((c) => (
            <Card key={c.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">
                  {c.name} {c.sigla ? <span className="text-muted-foreground">({c.sigla})</span> : null}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-4">
                <div className="space-y-1 text-sm text-muted-foreground">
                  {c.nivel && <p>• Nível: {c.nivel}</p>}
                  {c.modalidade && <p>• Modalidade: {c.modalidade}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <Link href={`/courses/${c.id}`} className="text-primary underline">
                    Abrir dashboard
                  </Link>
                  <Button asChild>
                    <Link href={`/courses/${c.id}/dimensions`}>Ir para dimensões</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
