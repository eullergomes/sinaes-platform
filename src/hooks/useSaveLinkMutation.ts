import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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

export function useSaveLinkMutation(params: {
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

  const mutation = useMutation({
    mutationFn: async (payload: {
      courseId: string;
      requirementId: string;
      text: string;
      url: string;
    }) => {
      const res = await fetch('/api/evidences/save-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok)
        throw new Error((await res.json()).error || 'Erro ao salvar link');
      return res.json();
    },
    onMutate: async (newLink) => {
      const previous = linkItems;
      setLinkItems((prev) => [
        ...prev,
        { text: newLink.text, url: newLink.url }
      ]);
      return { previous } as { previous: typeof linkItems };
    },
    onSuccess: (data: { linkId?: string }) => {
      if (data?.linkId) {
        setLinkItems((prev) => {
          const next = [...prev];
          for (let i = next.length - 1; i >= 0; i--) {
            if (!next[i].id) {
              next[i] = { ...next[i], id: data.linkId };
              break;
            }
          }
          return next;
        });
      }
    },
    onError: (err: unknown, _vars, ctx?: { previous: typeof linkItems }) => {
      if (ctx?.previous) setLinkItems(() => ctx.previous);
      const message =
        err instanceof Error ? err.message : 'Erro ao salvar link';
      toast.error(message);
    },
    onSettled: async () => {
      await invalidateIndicator(queryClient, {
        courseSlug,
        indicatorCode,
        evaluationYear
      });
      onLinkSaved?.();
    }
  });

  return { mutation };
}
