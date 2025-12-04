import { useEffect, useState } from 'react';

export function useCourseYears(slug: string) {
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [latestYear, setLatestYear] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    async function loadYears() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `/api/courses/${encodeURIComponent(slug)}/years`
        );
        if (!res.ok) return;
        const data = (await res.json()) as { years: number[]; latest?: number };
        if (!aborted) {
          setAvailableYears(data.years || []);
          setLatestYear(data.latest ?? null);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        if (!aborted) setError('Falha ao carregar os anos');
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    if (slug) loadYears();
    return () => {
      aborted = true;
    };
  }, [slug]);

  return { availableYears, latestYear, loading, error };
}
