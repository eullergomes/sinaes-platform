import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiAlert } from '@/types/alert-types';
import { isSingleYear } from '@/utils/isSingleYear';

export function usePendingAlerts(
  courseId?: string | null,
  yearParam?: string | null
) {
  const [alerts, setAlerts] = useState<ApiAlert[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(
    async (forcedYear?: number) => {
      if (!courseId) return;
      setLoading(true);
      setError(null);
      try {
        const y =
          forcedYear ?? (yearParam ? parseInt(yearParam, 10) : undefined);
        const url = y
          ? `/api/courses/${courseId}/alerts?year=${y}`
          : `/api/courses/${courseId}/alerts`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error('Falha ao carregar alertas');
        const json = await res.json();
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
    },
    [courseId, yearParam]
  );

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      await fetchAlerts();
    })();
  }, [courseId, fetchAlerts]);

  useEffect(() => {
    const listener = (ev: Event) => {
      const custom = ev as CustomEvent<{ courseId?: string; year?: number }>;
      const detail = custom.detail || {};
      if (!detail.courseId || detail.courseId !== courseId) return;
      fetchAlerts(detail.year ?? selectedYear);
    };
    window.addEventListener('alerts:refresh', listener as EventListener);
    return () => {
      window.removeEventListener('alerts:refresh', listener as EventListener);
    };
  }, [courseId, selectedYear, fetchAlerts]);

  const count = alerts.length;
  const items = useMemo(() => alerts.slice(0, 5), [alerts]);
  const remaining = Math.max(0, count - items.length);

  const refetch = () => fetchAlerts(selectedYear);
  return { alerts, items, remaining, selectedYear, loading, error, refetch };
}
