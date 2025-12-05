import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { DimensionApiResponse } from '@/types/dimension-types';

export function useDimensionData(
  slug: string,
  dimId: string,
  initialDimension?: DimensionApiResponse
) {
  const queryKey = useMemo(() => ['dimension', slug, dimId], [slug, dimId]);

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<
    DimensionApiResponse,
    Error
  >({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`/api/courses/${slug}/dimensions/${dimId}`);
      if (!res.ok) {
        throw new Error(
          (await res.json()).error || 'Falha ao carregar os dados'
        );
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    initialData: initialDimension,
    initialDataUpdatedAt: initialDimension ? Date.now() : undefined
  });

  return { data, isLoading, isError, error, isFetching, refetch, queryKey };
}
