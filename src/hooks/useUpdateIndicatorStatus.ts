import { useCallback, useState } from 'react';
import { IndicatorStatus } from '@prisma/client';

export function useUpdateIndicatorStatus(params: {
  courseSlug: string;
  dimensionId: string;
  year: number;
}) {
  const { courseSlug, dimensionId, year } = params;
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (code: string, next: IndicatorStatus) => {
      setError(null);
      setUpdating((prev) => ({ ...prev, [code]: true }));
      try {
        const res = await fetch(
          `/api/courses/${courseSlug}/dimensions/${dimensionId}/indicators/${code}/status`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: next, year })
          }
        );
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || 'Falha ao atualizar status');
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erro ao atualizar status';
        setError(msg);
        throw e;
      } finally {
        setUpdating((prev) => ({ ...prev, [code]: false }));
      }
    },
    [courseSlug, dimensionId, year]
  );

  return { updateStatus, updating, error };
}
