'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { DIMENSIONS } from '@/app/constants/dimensions';

// Tipagem simples para as notas globais por dimensão
type DimensionGrade = {
  dimId: '1' | '2' | '3';
  name: string;
  grade: number; // 0-5
};

// Mock de notas (troque por fetch da sua API)
const mockGrades: DimensionGrade[] = [
  { dimId: '1', name: 'Organização Didático-Pedagógica', grade: 3.5 },
  { dimId: '2', name: 'Corpo Docente e Tutorial', grade: 4.0 },
  { dimId: '3', name: 'Infraestrutura', grade: 3.0 }
];

export default function DimensionsPage() {
  const params = useParams() as { courseId: string };
  const { courseId } = params;

  // Se desejar, você pode fazer um fetch aqui e popular `grades` via estado.
  const [grades] = React.useState<DimensionGrade[]>(mockGrades);

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dimensões — {courseId}</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe o desempenho do curso nas 3 dimensões do SINAES.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {(['1', '2', '3'] as const).map((dimId) => {
          const meta = DIMENSIONS[dimId];
          const gradeItem = grades.find((g) => g.dimId === dimId);
          const grade = gradeItem?.grade ?? 0;

          return (
            <Card key={dimId} className="transition-shadow duration-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Dimensão {dimId}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xl font-semibold">{meta.title}</p>
                <p className="text-muted-foreground text-sm">{meta.description}</p>
                <p className="mt-2 text-lg">
                  <span className="font-semibold">Nota atual:</span> {grade.toFixed(1)}
                </p>

                <div className="pt-2">
                  <Button asChild>
                    <Link href={`/courses/${courseId}/dimensions/${dimId}`}>
                      Ver indicadores
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visão Geral — Notas por Dimensão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={grades.map((g) => ({ dimension: g.name, grade: g.grade }))}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="dimension" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Tooltip />
                <Radar
                  name="Nota"
                  dataKey="grade"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
