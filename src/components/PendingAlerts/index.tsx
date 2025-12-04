'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { IndicatorStatus } from '@prisma/client';
import { useIsMobile } from '@/hooks/use-mobile';

type ApiAlert = {
  dimensionId: number;
  dimensionLabel: string;
  code: string;
  name: string;
  status: IndicatorStatus;
  lastUpdate: string | null;
  year: number;
};

type ApiResponseSingleYear = {
  course: { id: string; slug: string; name: string };
  availableYears: number[];
  year: number;
  alerts: ApiAlert[];
};

function isSingleYear(res: unknown): res is ApiResponseSingleYear {
  return !!res && typeof res === 'object' && 'alerts' in res && 'year' in res;
}

function extractCourseId(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  const i = parts.indexOf('courses');
  if (i >= 0 && parts[i + 1]) return decodeURIComponent(parts[i + 1]);
  return null;
}

const PendingAlerts = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const search = useSearchParams();
  const courseId = extractCourseId(pathname);
  const yearParam = search?.get('year');

  const [alerts, setAlerts] = useState<ApiAlert[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    async function fetchAlerts() {
      setLoading(true);
      setError(null);
      try {
        const y = yearParam ? parseInt(yearParam, 10) : undefined;
        const url = y
          ? `/api/courses/${courseId}/alerts?year=${y}`
          : `/api/courses/${courseId}/alerts`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error('Falha ao carregar alertas');
        const json = await res.json();
        if (cancelled) return;
        if (isSingleYear(json)) {
          setAlerts(json.alerts);
          setSelectedYear(json.year);
        } else {
          const years = (json.availableYears as number[]) ?? [];
          const ysel = y ?? years[0];
          const all: ApiAlert[] = [];
          if (json.alertsByYear) {
            Object.keys(json.alertsByYear).forEach((k) => {
              const arr = json.alertsByYear[k] as ApiAlert[];
              all.push(...arr);
            });
          }
          setAlerts(all.filter((a) => a.year === ysel));
          setSelectedYear(ysel);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro inesperado');
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
    return () => {
      cancelled = true;
    };
  }, [courseId, yearParam]);

  const count = alerts.length;

  const items = useMemo(() => alerts.slice(0, 5), [alerts]);
  const remaining = Math.max(0, count - items.length);

  const buildIndicatorUrl = (dimensionId: number, code: string) => {
    if (!courseId) return '/courses';
    const y = selectedYear ?? '';
    return `/courses/${courseId}/dimensions/${dimensionId}/indicators/${code}?year=${y}`;
  };

  const ALL_ALERTS_URL = useMemo(() => {
    if (!courseId) return '/courses';
    const y = selectedYear ?? '';
    return `/courses/${courseId}/alerts${y ? `?year=${y}` : ''}`;
  }, [courseId, selectedYear]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={`Notificações (${count})`}
          className="relative rounded-md p-2 hover:cursor-pointer hover:bg-gray-100"
        >
          <Bell className="h-5 w-5" />
          <span className="pointer-events-none absolute -top-1 -right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-[10px] text-[10px] font-semibold text-white">
            {count}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align={isMobile ? 'center' : 'end'} className="w-80">
        <DropdownMenuLabel>Pendências e Alertas</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading && (
          <div className="text-muted-foreground px-2 py-1 text-xs">
            Carregando…
          </div>
        )}
        {!loading && error && (
          <div className="text-destructive px-2 py-1 text-xs">{error}</div>
        )}
        {!loading && !error && count === 0 && (
          <div className="text-muted-foreground px-2 py-1 text-xs">
            Sem pendências para o ano selecionado.
          </div>
        )}

        {!loading &&
          !error &&
          items.map((a) => {
            const url = buildIndicatorUrl(a.dimensionId, a.code);
            return (
              <DropdownMenuItem
                key={`${a.dimensionId}-${a.code}`}
                onSelect={() => router.push(url)}
                className="hover:cursor-pointer hover:bg-gray-50"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="text-sm font-medium">
                    {a.dimensionLabel || `Dimensão ${a.dimensionId}`}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">{`${a.code} — ${a.name}`}</span>
                </div>
              </DropdownMenuItem>
            );
          })}

        {remaining > 0 && !loading && !error && (
          <div className="text-muted-foreground px-2 py-1 text-xs font-bold">
            …e mais {remaining} pendência(s)
          </div>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => router.push(ALL_ALERTS_URL)}
          className="flex justify-center bg-green-600 text-white hover:cursor-pointer hover:bg-green-700"
        >
          Ver todos
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PendingAlerts;
