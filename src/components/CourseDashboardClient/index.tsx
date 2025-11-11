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
import { Course } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PieChart, Pie, Cell, Tooltip as RPieTooltip } from 'recharts';

type DimId = '1' | '2' | '3';
type Status = 'Concluído' | 'Em edição' | 'Não atingido';
const STATUSES: Status[] = ['Concluído', 'Em edição', 'Não atingido'];

type CriterionRow = { dimension: string; label: string; grade: number };

type Props = {
  course: Course;
  indicators: Array<{
    id: string;
    dimension: DimId;
    code?: string;
    grade: number | null;
    status: Status;
    lastUpdate?: string | null;
  }>;
  availableYears?: number[];
  selectedYear?: number;
};

const CourseDashboardClient = ({
  indicators,
  course,
  availableYears = [],
  selectedYear
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
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

  const statusPieData = useMemo(() => {
    const counts: Record<Status, number> = {
      Concluído: 0,
      'Em edição': 0,
      'Não atingido': 0
    };
    indicators.forEach((i) => counts[i.status]++);
    return STATUSES.map((s) => ({ name: s, value: counts[s] }));
  }, [indicators]);

  const stackedPercentData = useMemo(() => {
    return (['1', '2', '3'] as DimId[]).map((dimId) => {
      const group = indicators.filter((i) => i.dimension === dimId);
      const total = group.length || 1;
      const row: Record<string, number | string> = {
        dim: `D${dimId}`,
        name: `Dimensão ${dimId}`
      };
      STATUSES.forEach((st) => {
        const c = group.filter((g) => g.status === st).length;
        row[st] = Math.round((c / total) * 100);
      });
      return row;
    });
  }, [indicators]);

  const gradeDistribution = useMemo(() => {
    const bins = { NSA: 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 } as Record<
      string,
      number
    >;
    indicators.forEach((i) => {
      if (i.grade === null) bins['NSA']++;
      else bins[String(i.grade)]++;
    });
    return [
      { label: 'NSA', value: bins['NSA'] },
      { label: '1', value: bins['1'] },
      { label: '2', value: bins['2'] },
      { label: '3', value: bins['3'] },
      { label: '4', value: bins['4'] },
      { label: '5', value: bins['5'] }
    ];
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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">
            Dashboard do Curso{' '}
            <span className="text-foreground font-semibold">
              — {course.name}
            </span>
          </h1>
          {availableYears.length > 0 && (
            <div className="flex items-center gap-2">
              <Select
                value={selectedYear ? String(selectedYear) : undefined}
                onValueChange={(v) => {
                  const y = Number(v);
                  const url = `${pathname}?year=${y}`;
                  router.push(url);
                }}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Ano" />
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
          )}
        </div>
        <p className="text-muted-foreground text-lg">
          Visão geral dos indicadores do SINAES.
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
                <Bar
                  dataKey="Concluído"
                  fill="var(--color-green-500)"
                  stroke="var(--color-green-500)"
                />
                <Bar
                  dataKey="Em edição"
                  fill="var(--color-yellow-400)"
                  stroke="var(--color-yellow-400)"
                />
                <Bar
                  dataKey="Não atingido"
                  fill="var(--color-red-600)"
                  stroke="var(--color-red-600)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Status (Geral)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {statusPieData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={
                          entry.name === 'Concluído'
                            ? 'var(--color-green-500)'
                            : entry.name === 'Em edição'
                              ? 'var(--color-yellow-400)'
                              : 'var(--color-red-600)'
                        }
                      />
                    ))}
                  </Pie>
                  <RPieTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proporção de Status por Dimensão (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stackedPercentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <RTooltip formatter={(v: number) => `${v}%`} />
                  <Legend />
                  <Bar
                    dataKey="Concluído"
                    stackId="a"
                    fill="var(--color-green-500)"
                  />
                  <Bar
                    dataKey="Em edição"
                    stackId="a"
                    fill="var(--color-yellow-400)"
                  />
                  <Bar
                    dataKey="Não atingido"
                    stackId="a"
                    fill="var(--color-red-600)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Notas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <RTooltip />
                <Bar
                  dataKey="value"
                  name="Quantidade"
                  fill="var(--color-green-500)"
                  stroke="var(--color-green-500)"
                />
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
};

export default CourseDashboardClient;
