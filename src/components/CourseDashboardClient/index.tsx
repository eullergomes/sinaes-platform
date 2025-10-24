'use client';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';

type DimId = '1' | '2' | '3';
type Status = 'Concluído' | 'Em edição' | 'Não atingido';
const STATUSES: Status[] = ['Concluído', 'Em edição', 'Não atingido'];

type CriterionRow = { dimension: string; label: string; grade: number };

type Props = {
  courseId: string;
  indicators: Array<{
    id: string;
    dimension: DimId;
    grade: number | null;
    status: Status;
    lastUpdate?: string | null;
  }>;
};

const CourseDashboardClient = ({ courseId, indicators }: Props) => {
  const kpi = useMemo(() => {
    const withoutNSA = indicators
      .map((i) => i.grade)
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

  const radarData = useMemo(() => {
    const byDim: Record<DimId, number[]> = { '1': [], '2': [], '3': [] };
    indicators.forEach((i) => {
      if (i.grade !== null) byDim[i.dimension].push(i.grade);
    });
    return (['1', '2', '3'] as DimId[]).map((dimId) => {
      const arr = byDim[dimId];
      const avg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      return {
        dimension: `Dimensão ${dimId}`,
        label: `Dimensão ${dimId}`,
        grade: Number(avg.toFixed(2))
      } as CriterionRow;
    });
  }, [indicators]);

  const barData = useMemo(() => {
    return (['1', '2', '3'] as DimId[]).map((dimId) => {
      const group = indicators.filter((i) => i.dimension === dimId);
      const row: Record<string, number | string> = {
        dim: `D${dimId}`,
        name: `Dimensão ${dimId}`
      };
      STATUSES.forEach((st) => {
        row[st] = group.filter((g) => g.status === st).length;
      });
      return row;
    });
  }, [indicators]);

  const lineData = useMemo(() => {
    const days = Array.from({ length: 30 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toISOString().slice(0, 10);
    });
    const countByDay: Record<string, number> = Object.fromEntries(
      days.map((d) => [d, 0])
    );
    indicators.forEach((i) => {
      if (i.lastUpdate && countByDay[i.lastUpdate] !== undefined)
        countByDay[i.lastUpdate] += 1;
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
                  stroke="#16a34a"
                  fill="#16a34a"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
                <Bar dataKey="Concluído" fill="#16a34a" stroke="#16a34a" />
                <Bar dataKey="Em edição" fill="#f97316" stroke="#f97316" />
                <Bar dataKey="Não atingido" fill="#f59e0b" stroke="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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

export default CourseDashboardClient;