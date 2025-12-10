import { useQuery } from '@tanstack/react-query';
import type { IndicatorGrade } from '@prisma/client';
import type { ExistingFile as ExistingFileType } from '@/types/indicator-types';

export type LinkItem = { id?: string; text: string; url: string };
export type ExistingFile = ExistingFileType;
export type ApiIndicatorData = {
  course: { id: string; slug: string };
  indicator: { id: string; code: string; name: string; criteriaTable: unknown };
  evaluation: {
    grade: IndicatorGrade;
    justification: string | null;
    correctiveAction: string | null;
    responsible: string | null;
    nsaApplicable?: boolean | null;
  } | null;
  requiredEvidences: {
    id: string;
    slug: string;
    title: string;
    submission: {
      folderUrls: string[] | null;
      files: ExistingFile[];
      links?: LinkItem[];
    } | null;
  }[];
};

export function useIndicatorData(
  courseSlug: string | null,
  indicatorCode: string | null,
  year: number | null
) {
  const queryKey = ['indicator', courseSlug, indicatorCode, year];
  const queryFn = async (): Promise<ApiIndicatorData> => {
    if (!courseSlug || !indicatorCode || !year) {
      throw new Error('Parâmetros inválidos na URL.');
    }
    const response = await fetch(
      `/api/courses/${courseSlug}/indicators/${indicatorCode}?year=${year}`
    );
    if (!response.ok)
      throw new Error((await response.json()).error || 'Erro ao carregar');
    const result: ApiIndicatorData = await response.json();

    return result;
  };

  const query = useQuery<ApiIndicatorData>({
    queryKey,
    queryFn,
    enabled: !!courseSlug && !!indicatorCode && !!year
    // Do not hydrate from initialIndicator to avoid stale data without link ids
  });

  return query;
}
