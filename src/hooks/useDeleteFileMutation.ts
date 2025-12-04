import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExistingFile } from '@/types/indicator-types';

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

export function useDeleteFileMutation(params: {
  currentFiles: ExistingFile[];
  setCurrentFiles: (updater: (prev: ExistingFile[]) => ExistingFile[]) => void;
  courseSlug?: string;
  indicatorCode?: string;
  evaluationYear?: number | null;
  onLinkSaved?: () => void;
}) {
  const {
    currentFiles,
    setCurrentFiles,
    courseSlug,
    indicatorCode,
    evaluationYear,
    onLinkSaved
  } = params;
  const queryClient = useQueryClient();
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  interface DeleteFileContext {
    previous: ExistingFile[];
  }

  const mutation = useMutation({
    mutationFn: async (payload: {
      courseId: string;
      requirementId: string;
      publicId: string;
    }) => {
      const res = await fetch('/api/evidences/delete-file', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok)
        throw new Error((await res.json()).error || 'Erro ao deletar arquivo');
      return res.json();
    },
    onMutate: async ({ publicId }) => {
      const previous = currentFiles;
      setDeletingFileId(publicId);
      setCurrentFiles((prev) => prev.filter((f) => f.publicId !== publicId));
      return { previous } as DeleteFileContext;
    },
    onError: (_err, _vars, ctx?: DeleteFileContext) => {
      if (ctx?.previous) setCurrentFiles(() => ctx.previous);
    },
    onSettled: async () => {
      setDeletingFileId(null);
      await invalidateIndicator(queryClient, {
        courseSlug,
        indicatorCode,
        evaluationYear
      });
      onLinkSaved?.();
    }
  });

  return { mutation, deletingFileId };
}
