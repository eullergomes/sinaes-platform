import { ApiAlert } from '@/types/alert-types';
import { isSingleYear } from '@/utils/isSingleYear';
import { useCallback, useEffect, useState } from 'react';

export function useCourseAlerts(courseId: string | null) {
  const [data, setData] = useState<ApiAlert[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const fetchAlerts = useCallback(
    async (year?: number) => {
      if (!courseId) return;
      setLoading(true);
      setError(null);
      try {
        const url = year
          ? `/api/courses/${courseId}/alerts?year=${year}`
          : `/api/courses/${courseId}/alerts`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(
            (await res.json()).error || 'Falha ao carregar alertas'
          );
        }
        const json = await res.json();
        if (isSingleYear(json)) {
          setAvailableYears(json.availableYears);
          setData(json.alerts);
          setSelectedYear(json.year);
        } else {
          const years = json.availableYears as number[];
          setAvailableYears(years);
          const y = year ?? years[0];
          const all: ApiAlert[] = [];
          if (json.alertsByYear) {
            Object.keys(json.alertsByYear).forEach((k) => {
              const arr = json.alertsByYear[k] as ApiAlert[];
              all.push(...arr);
            });
          }
          setData(all.filter((a) => a.year === y));
          setSelectedYear(y);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro inesperado');
      } finally {
        setLoading(false);
      }
    },
    [courseId]
  );

  useEffect(() => {
    if (courseId) {
      fetchAlerts(selectedYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, refetchIndex]);

  const refetch = useCallback(() => setRefetchIndex((i) => i + 1), []);

  return {
    data,
    availableYears,
    selectedYear,
    setSelectedYear,
    loading,
    error,
    fetchAlerts,
    refetch
  };
}
