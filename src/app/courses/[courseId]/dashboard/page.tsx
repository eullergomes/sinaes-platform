'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { indicators as ALL_INDICATORS } from '@/app/constants/indicators';
import { DIMENSIONS } from '@/app/constants/dimensions';

import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip as RTooltip,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend
} from 'recharts';

type DimId = '1' | '2' | '3';
type Status = 'Concluído' | 'Em revisão' | 'Pendente';
const STATUSES: Status[] = ['Concluído', 'Em revisão', 'Pendente'];

/** Converte 'NSA' em null; números como string em number */
function gradeToNumber(grade: string): number | null {
  if (grade === 'NSA') return null;
  const n = Number(grade);
  return Number.isFinite(n) ? n : null;
}

/** Gera um range de datas (YYYY-MM-DD) dos últimos N dias (inclui hoje) */
function lastNDates(n = 30): string[] {
  const arr: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    arr.push(iso);
  }
  return arr;
}

export default function CourseDashboardPage() {
  const params = useParams() as { courseId: string };
  const courseId = params.courseId;

  // Se no futuro cada curso tiver seus próprios indicadores, filtre aqui por courseId
  // const indicators = React.useMemo(() => ALL_INDICATORS.filter(i => i.courseId === courseId), [courseId]);
  const indicators = ALL_INDICATORS; // por enquanto, usa todos

  // ===== KPIs =====
  const kpi = React.useMemo(() => {
    const withoutNSA = indicators
      .map((i) => gradeToNumber(i.grade))
      .filter((g): g is number => g !== null);
    const avg = withoutNSA.length
      ? withoutNSA.reduce((a, b) => a + b, 0) / withoutNSA.length
      : 0;
    const total = indicators.length;
    const concluded = indicators.filter((i) => i.status === 'Concluído').length;
    return {
      total,
      avg: Number(avg.toFixed(2)),
      concludedPct: total ? Math.round((concluded / total) * 100) : 0
    };
  }, [indicators]);

  // ===== Radar: média por dimensão =====
  const radarData = React.useMemo(() => {
    const byDim: Record<DimId, number[]> = { '1': [], '2': [], '3': [] };
    indicators.forEach((i) => {
      const g = gradeToNumber(i.grade);
      if (g !== null) byDim[i.dimension as DimId].push(g);
    });
    const dimEntries = (['1', '2', '3'] as DimId[]).map((dimId) => {
      const arr = byDim[dimId];
      const avg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      return {
        dimension: `Dimensão ${dimId}`,
        label: DIMENSIONS[dimId].title,
        grade: Number(avg.toFixed(2))
      };
    });
    return dimEntries;
  }, [indicators]);

  // ===== Barras: status por dimensão =====
  const barData = React.useMemo(() => {
    const base = (['1', '2', '3'] as DimId[]).map((dimId) => {
      const group = indicators.filter((i) => i.dimension === dimId);
      const row: any = {
        dim: `D${dimId}`,
        name: `Dimensão ${dimId}`
      };
      STATUSES.forEach((st) => {
        row[st] = group.filter((g) => g.status === st).length;
      });
      return row;
    });
    return base;
  }, [indicators]);

  // ===== Linha: atualizações nos últimos 30 dias =====
  const lineData = React.useMemo(() => {
    const days = lastNDates(30);
    const countByDay: Record<string, number> = Object.fromEntries(
      days.map((d) => [d, 0])
    );
    indicators.forEach((i) => {
      if (
        i.lastUpdate &&
        i.lastUpdate !== '-' &&
        countByDay[i.lastUpdate] !== undefined
      ) {
        countByDay[i.lastUpdate] += 1;
      }
    });
    return days.map((d) => ({ date: d, updates: countByDay[d] }));
  }, [indicators]);

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard do Curso — {courseId}</h1>
        <p className="text-muted-foreground text-sm">
          Visão geral dos indicadores do SINAES
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Indicadores</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {kpi.total}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Média Geral</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {kpi.avg}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>% Concluídos</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {kpi.concludedPct}%
          </CardContent>
        </Card>
      </div>

      {/* Radar: média por dimensão */}
      <Card>
        <CardHeader>
          <CardTitle>Média por Dimensão (0–5)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dimension" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <RTooltip />
                <Radar
                  name="Média"
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

      {/* Barras: status por dimensão */}
      <Card>
        <CardHeader>
          <CardTitle>Status por Dimensão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <RTooltip />
                <Legend />
                {/* Concluído = verde */}
                <Bar dataKey="Concluído" fill="oklch(62.7% 0.194 149.214)" stroke="oklch(62.7% 0.194 149.214)" />
                {/* Em revisão = vermelho */}
                <Bar dataKey="Em revisão" fill="oklch(50.5% 0.213 27.518)" stroke="oklch(50.5% 0.213 27.518)" />
                {/* Pendente = amarelo */}
                <Bar dataKey="Pendente" fill="oklch(79.5% 0.184 86.047)" stroke="oklch(79.5% 0.184 86.047)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Linha: evolução de atualizações */}
      <Card>
        <CardHeader>
          <CardTitle>Atualizações nos últimos 30 dias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <RTooltip />
                <Line
                  type="monotone"
                  dataKey="updates"
                  stroke="#8884d8"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
