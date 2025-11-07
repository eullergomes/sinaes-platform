'use client';

import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip
} from 'recharts';
import { DimensionDefinition } from '@prisma/client';
import DimensionItem from './dimension-item';
import NewCycle from '@/components/new-cycle-dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Download, PlusCircle } from 'lucide-react';
import ReportButton from './report-button';

type DimensionWithGrade = DimensionDefinition & {
  averageGrade: number;
};

type Props = {
  slug: string;
  dimensionsWithGrades: DimensionWithGrade[];
  hasCycles: boolean;
  currentYear: number | null;
};

const DimensionList = ({
  slug,
  dimensionsWithGrades,
  hasCycles,
  currentYear
}: Props) => {
  const courseName = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const radarData = useMemo(
    () =>
      dimensionsWithGrades.map((d) => ({
        dimension: `Dim. ${d.number}`,
        grade: d.averageGrade
      })),
    [dimensionsWithGrades]
  );

  const router = useRouter();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [currentYearState, setCurrentYearState] = useState<number | null>(
    currentYear
  );

  useEffect(() => {
    let aborted = false;
    async function loadYears() {
      try {
        const res = await fetch(
          `/api/courses/${encodeURIComponent(slug)}/years`
        );
        if (!res.ok) return;
        const data = (await res.json()) as { years: number[]; latest?: number };
        if (!aborted) {
          setAvailableYears(data.years || []);
          setCurrentYearState(data.latest ?? null);
        }
      } catch {}
    }
    loadYears();
    return () => {
      aborted = true;
    };
  }, [slug]);

  async function handleCreateCycle(y: number, copyFromPrevious: boolean) {
    const res = await fetch(`/api/courses/${encodeURIComponent(slug)}/cycles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year: y, copyFromPrevious })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || 'Falha ao criar ciclo');
    }
    toast.success('Primeiro ciclo criado com sucesso.');
    setCurrentYearState(y);
    setAvailableYears((prev) => {
      if (prev.includes(y)) return prev;
      const next = [...prev, y];
      next.sort((a, b) => a - b);
      return next;
    });
    const url = new URL(window.location.href);
    url.searchParams.set('year', String(y));
    window.history.replaceState({}, '', url.toString());
    router.refresh();
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">
            Dimensões{' '}
            <span className="text-foreground font-semibold">
              — {courseName}
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Acompanhe o desempenho do curso nas 3 dimensões do SINAES.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 hover:cursor-pointer"
          >
            <a
              href="/assets/pdf/pdf-1.pdf"
              download
              aria-label={`Baixar Manual de Instruções}`}
              className="inline-flex items-center gap-2"
            >
              <Download className="mr-2 h-4 w-4" />
              Manual de instruções
            </a>
          </Button>
          <NewCycle
            open={dialogIsOpen}
            onOpenChange={setDialogIsOpen}
            onCreate={handleCreateCycle}
            trigger={
              <Button className="cursor-pointer bg-green-600 hover:bg-green-700">
                Criar ciclo
              </Button>
            }
          />
        </div>
      </div>

      {!hasCycles ? (
        <Card>
          <CardContent className="space-y-4 py-12 text-center">
            <p className="text-lg">
              Este curso ainda não possui ciclos de avaliação.
            </p>
            <NewCycle
              open={dialogIsOpen}
              onOpenChange={setDialogIsOpen}
              onCreate={handleCreateCycle}
              trigger={
                <Button className="cursor-pointer bg-green-600 hover:bg-green-700">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Iniciar Primeiro Ciclo Avaliativo
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground text-sm font-bold">
                Selecione o ciclo avaliativo
              </div>
              <div className="w-48">
                <Select
                  value={currentYearState ? String(currentYearState) : ''}
                  onValueChange={(v) => {
                    const yr = parseInt(v, 10);
                    if (Number.isInteger(yr)) {
                      setCurrentYearState(yr);
                      const url = new URL(window.location.href);
                      url.searchParams.set('year', String(yr));
                      window.history.replaceState({}, '', url.toString());
                      router.refresh();
                    }
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Ano do ciclo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {dimensionsWithGrades.map((dim) => (
              <DimensionItem
                key={dim.id}
                slug={slug}
                dimensionWithGrade={dim}
                currentYear={currentYearState ?? undefined}
              />
            ))}
          </div>

          <Card>
            <CardHeader className='flex justify-between items-center'>
              <CardTitle>Visão Geral — Notas por Dimensão</CardTitle>
              <ReportButton />
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} />
                    <Tooltip formatter={(value: number) => value.toFixed(2)} />
                    <Radar
                      name="Nota Média"
                      dataKey="grade"
                      stroke="#16a34a"
                      fill="#16a34a"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DimensionList;
