import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface InvalidateArgs {
  courseSlug?: string;
  indicatorCode?: string;
  evaluationYear?: number | null;
}

function invalidateIndicator(
  queryClient: ReturnType<typeof useQueryClient>,
  args: InvalidateArgs
) {
  const { courseSlug, indicatorCode, evaluationYear } = args;
  if (courseSlug && indicatorCode && evaluationYear != null) {
    return queryClient.invalidateQueries({
      queryKey: ['indicator', courseSlug, indicatorCode, evaluationYear]
    });
  }
  return queryClient.invalidateQueries({ queryKey: ['indicator'] });
}

export function useDeleteLinkMutation(params: {
  linkItems: Array<{ id?: string; text: string; url: string }>;
  setLinkItems: (
    updater: (
      prev: Array<{ id?: string; text: string; url: string }>
    ) => Array<{ id?: string; text: string; url: string }>
  ) => void;
  courseSlug?: string;
  indicatorCode?: string;
  evaluationYear?: number | null;
  onLinkSaved?: () => void;
}) {
  const {
    linkItems,
    setLinkItems,
    courseSlug,
    indicatorCode,
    evaluationYear,
    onLinkSaved
  } = params;
  const queryClient = useQueryClient();
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);

  interface DeleteLinkContext {
    previous: typeof linkItems;
  }

  const mutation = useMutation({
    mutationFn: async (payload: {
      courseId: string;
      requirementId: string;
      linkId: string;
    }) => {
      const res = await fetch('/api/evidences/delete-link', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok)
        throw new Error((await res.json()).error || 'Erro ao deletar link');
      return res.json();
    },
    onMutate: async ({ linkId }) => {
      const previous = linkItems;
      setDeletingLinkId(linkId);
      setLinkItems((prev) => prev.filter((l) => l.id !== linkId));
      return { previous } as DeleteLinkContext;
    },
    onError: (_err, _vars, ctx?: DeleteLinkContext) => {
      if (ctx?.previous) setLinkItems(() => ctx.previous);
    },
    onSettled: async () => {
      setDeletingLinkId(null);
      await invalidateIndicator(queryClient, {
        courseSlug,
        indicatorCode,
        evaluationYear
      });
      onLinkSaved?.();
    }
  });

  return { mutation, deletingLinkId };
}
