import { useCallback, useState } from 'react';

export function useCreateCycle(slug: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCycle = useCallback(
    async (year: number, copyFromPrevious: boolean) => {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `/api/courses/${encodeURIComponent(slug)}/cycles`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ year, copyFromPrevious })
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Falha ao criar ciclo');
        setLoading(false);
        throw new Error(data?.error || 'Falha ao criar ciclo');
      }
      setLoading(false);
      return true;
    },
    [slug]
  );

  return { createCycle, loading, error };
}
