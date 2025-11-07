'use client';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  startTransition
} from 'react';
import { useActionState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import FileUpload from '@/components/file-upload';
import {
  saveIndicatorEvaluation,
  SaveIndicatorState
} from '@/actions/indicator';
import { uploadToCloudinary } from '@/services/uploadToCloudinary';
import { useSearchParams } from 'next/navigation';

// --- SIMULAÇÃO DE DEPENDÊNCIAS EXTERNAS PARA O PREVIEW ---
const IndicatorGrade = {
  G1: 'G1',
  G2: 'G2',
  G3: 'G3',
  G4: 'G4',
  G5: 'G5',
  NSA: 'NSA'
} as const;
type IndicatorGradeEnum = keyof typeof IndicatorGrade;

// Tipo para metadados de arquivos enviados ao Cloudinary
type UploadedFileInfo = {
  storageKey: string;
  externalUrl: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
};

// --- COMPONENTE FILEUPLOAD (Integrado e modificado) ---
type ExistingFile = {
  fileName: string;
  sizeBytes?: number | null;
  url?: string | null;
  publicId?: string;
};

type LinkItem = { text: string; url: string };

// --- Tipagem para os dados da API ---
type CriterionRow = { concept: string; criterion: string };
type ApiIndicatorData = {
  course: { id: string; slug: string };
  indicator: { id: string; code: string; name: string; criteriaTable: unknown };
  evaluation: {
    grade: IndicatorGradeEnum;
    justification: string | null;
    correctiveAction: string | null;
    responsible: string | null;
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

const ClientIndicatorPage = ({
  slug,
  indicadorCode,
  dimensionId
}: {
  slug: string;
  indicadorCode: string;
  dimensionId: string;
}) => {
  const params = {
    slug,
    indicatorCode: indicadorCode,
    dimensionId: dimensionId
  };
  const searchParams = useSearchParams();
  const yearStr = searchParams.get('year');
  const year =
    yearStr && !Number.isNaN(Number(yearStr)) ? parseInt(yearStr, 10) : null;

  const { slug: courseSlug, indicatorCode } = params;

  const [data, setData] = useState<ApiIndicatorData | null>(null);

  const [grade, setGrade] = useState<IndicatorGradeEnum>(IndicatorGrade.NSA);
  const [justification, setJustification] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [responsible, setResponsible] = useState('');
  const [evidenceStates, setEvidenceStates] = useState<
    Record<
      string,
      { links: string[]; filesToUpload: File[]; linkItems?: LinkItem[] }
    >
  >({});
  const formRef = useRef<HTMLFormElement>(null);

  // Server Action state
  const initialState: SaveIndicatorState = { errors: {}, success: false };
  const [formState, formAction] = useActionState(
    saveIndicatorEvaluation,
    initialState
  );
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  const queryKey = ['indicator', courseSlug, indicatorCode, year];
  const queryFn = useCallback(async (): Promise<ApiIndicatorData> => {
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
  }, [courseSlug, indicatorCode, year]);

  const {
    data: apiData,
    isLoading: queryLoading,
    refetch,
    error: queryError
  } = useQuery({
    queryKey,
    queryFn,
    enabled: !!courseSlug && !!indicatorCode && !!year
  });

  useEffect(() => {
    if (!apiData) return;
    setData(apiData);
    setGrade(apiData.evaluation?.grade || IndicatorGrade.NSA);
    setJustification(apiData.evaluation?.justification || '');
    setCorrectiveAction(apiData.evaluation?.correctiveAction || '');
    setResponsible(apiData.evaluation?.responsible || '');
    const initialEvidences: Record<
      string,
      { links: string[]; filesToUpload: File[]; linkItems?: LinkItem[] }
    > = {};
    apiData.requiredEvidences.forEach(
      (ev: ApiIndicatorData['requiredEvidences'][number]) => {
        const linksArray = Array.isArray(ev.submission?.folderUrls)
          ? ev.submission.folderUrls
          : [];
        initialEvidences[ev.slug] = {
          links: linksArray.length > 0 ? linksArray : [''],
          filesToUpload: [],
          linkItems: Array.isArray(ev.submission?.links)
            ? ev.submission?.links
            : undefined
        };
      }
    );
    setEvidenceStates(initialEvidences);
  }, [apiData]);

  useEffect(() => {
    if (formState?.errors?._form)
      toast.error(formState.errors._form.join(', '));
    if (formState?.success) {
      toast.success('Avaliação salva com sucesso!');
    }
    setIsSubmittingManual(false);
  }, [formState]);

  useEffect(() => {
    if (formState?.success) {
      refetch();
    }
  }, [formState?.success, refetch]);

  const handleEvidenceStateChange = useCallback(
    (
      slug: string,
      state: { links: string[]; filesToUpload: File[]; linkItems?: LinkItem[] }
    ) => {
      setEvidenceStates((prev) => ({ ...prev, [slug]: state }));
    },
    []
  );

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!data || !data.course || !data.indicator || !year || isSubmittingManual)
      return;

    setIsSubmittingManual(true);
    const formData = new FormData();

    formData.append('courseId', data.course.id);
    formData.append('indicatorDefId', data.indicator.id);
    formData.append('courseSlug', data.course.slug);
    formData.append('evaluationYear', year.toString());
    formData.append('grade', grade);
    if (['G1', 'G2', 'G3', 'G4'].includes(grade)) {
      formData.append('justification', justification);
      formData.append('correctiveAction', correctiveAction);
      formData.append('responsible', responsible);
    }

    const filesUploadedInfo: Record<string, UploadedFileInfo[]> = {};
    const uploadPromises: Promise<void>[] = [];
    let uploadFailed = false;

    toast.dismiss();

    for (const [slug, state] of Object.entries(evidenceStates)) {
      if (state.filesToUpload.length > 0) {
        filesUploadedInfo[slug] = [];
        state.filesToUpload.forEach((file) => {
          uploadPromises.push(
            uploadToCloudinary(
              file,
              `sinaes-evidence/${courseSlug}/${year}/${slug}`
            )
              .then((result) => {
                filesUploadedInfo[slug].push({
                  storageKey: result.public_id,
                  externalUrl: result.secure_url,
                  fileName: result.original_filename || file.name,
                  sizeBytes: result.bytes,
                  mimeType: file.type || 'application/pdf'
                });
              })
              .catch((err) => {
                console.error(`Erro upload ${file.name} (${slug}):`, err);
                toast.error(`Falha ao enviar: ${file.name}`);
                uploadFailed = true;
              })
          );
        });
      }
    }

    try {
      if (uploadPromises.length > 0) {
        toast.info('Enviando arquivos...', { id: 'uploading-toast' });
        await Promise.all(uploadPromises);
        toast.dismiss('uploading-toast');
      }

      if (uploadFailed) {
        toast.error(
          'Alguns arquivos falharam ao enviar. Verifique e tente novamente.'
        );
        setIsSubmittingManual(false);
        return;
      }

      toast.info('Salvando avaliação...', { id: 'saving-toast' });

      Object.entries(evidenceStates).forEach(([slug, state]) => {
        const validLinks = state.links.filter((link) => link.trim());
        validLinks.forEach((link, index) => {
          formData.append(`evidence-${slug}-link[${index}]`, link);
        });
        const linkItems: LinkItem[] =
          state.linkItems && state.linkItems.length > 0
            ? state.linkItems.filter((li) => li && li.url && li.text)
            : validLinks.map((u) => ({ text: u, url: u }));
        formData.append(
          `evidence-${slug}-linkItems`,
          JSON.stringify(linkItems)
        );
        formData.append(
          `evidence-${slug}-fileInfo`,
          JSON.stringify(filesUploadedInfo[slug] || [])
        );
      });

      startTransition(() => {
        formAction(formData);
      });
    } catch (error) {
      toast.dismiss('saving-toast');
      console.error('Erro durante o processo de salvamento:', error);
      toast.error('Ocorreu um erro inesperado durante o envio.');
      setIsSubmittingManual(false);
    }
  };

  if (queryLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Carregando...</p>
      </div>
    );
  }
  if (queryError) {
    return (
      <div className="text-destructive p-8 text-center">
        {queryError instanceof Error ? queryError.message : String(queryError)}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="p-8 text-center">
        Erro ao carregar dados essenciais do curso ou indicador.
      </div>
    );
  }

  const criterions: CriterionRow[] = Array.isArray(data.indicator.criteriaTable)
    ? (data.indicator.criteriaTable as CriterionRow[])
    : [];

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">
        Indicador {data.indicator.code}
        <span className="text-muted-foreground font-normal">
          {' '}
          — {data.indicator.name}
        </span>
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Critérios de Avaliação</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="min-w-full border text-sm">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="border p-2 text-center font-semibold">Nota</th>
                <th className="border p-2 text-left font-semibold">Critério</th>
              </tr>
            </thead>
            <tbody>
              {criterions.map((item) => (
                <tr key={item.concept}>
                  <td className="border p-2 text-center font-semibold">
                    {item.concept}
                  </td>
                  <td className="border p-2">{item.criterion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <form ref={formRef} onSubmit={handleFormSubmit}>
        <input type="hidden" name="courseId" value={data.course.id} />
        <input type="hidden" name="courseSlug" value={data.course.slug} />
        <input type="hidden" name="indicatorDefId" value={data.indicator.id} />
        <input type="hidden" name="evaluationYear" value={year ?? ''} />

        <Card>
          <CardHeader>
            <CardTitle>Evidências e Documentos Comprobatórios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 rounded-md border p-4">
              {data.requiredEvidences.length > 0 ? (
                data.requiredEvidences.map((evidence) => (
                  <div
                    key={evidence.id}
                    className="space-y-2 border-b pb-4 last:border-b-0"
                  >
                    <Label className="font-semibold">{evidence.title}</Label>
                    <FileUpload
                      evidenceSlug={evidence.slug}
                      initialLinks={evidence.submission?.folderUrls || ['']}
                      initialLinkItems={evidence.submission?.links}
                      initialFiles={evidence.submission?.files || []}
                      onStateChange={handleEvidenceStateChange}
                      isLoading={isSubmittingManual}
                      courseId={data.course.id}
                      requirementId={evidence.id}
                      onLinkSaved={() => refetch()}
                      courseSlug={courseSlug}
                      indicatorCode={indicatorCode}
                      evaluationYear={year}
                    />
                    {formState?.errors?.[
                      `evidences[${evidence.slug}].links`
                    ] && (
                      <p className="text-destructive text-sm">
                        {
                          formState.errors[
                            `evidences[${evidence.slug}].links`
                          ]?.[0]
                        }
                      </p>
                    )}
                    {formState?.errors?.[
                      `evidences[${evidence.slug}].files`
                    ] && (
                      <p className="text-destructive text-sm">
                        {
                          formState.errors[
                            `evidences[${evidence.slug}].files`
                          ]?.[0]
                        }
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  Nenhum documento.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Nota atribuída <span className="text-destructive">*</span>
              </Label>
              <Select
                name="grade"
                value={grade}
                onValueChange={(v) => setGrade(v as IndicatorGradeEnum)}
                required
                disabled={isSubmittingManual}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(IndicatorGrade).map((g) => (
                    <SelectItem key={g} value={g}>
                      {g === 'NSA' ? 'NSA' : g.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formState?.errors?.grade && (
                <p className="text-destructive text-sm">
                  {formState.errors.grade[0]}
                </p>
              )}
            </div>

            {['G1', 'G2', 'G3', 'G4'].includes(grade) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">
                    Plano de ação:
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" aria-label="info">
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      O que deve ser feito para atingir nota máxima
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-fixed border text-sm">
                    <colgroup>
                      <col className="w-1/3" />
                      <col className="w-1/3" />
                      <col className="w-1/3" />
                    </colgroup>
                    <thead className="bg-green-600">
                      <tr>
                        <th className="border p-2 text-left text-white">
                          Justificativa
                        </th>
                        <th className="border p-2 text-left text-white">
                          Ação Corretiva
                        </th>
                        <th className="border p-2 text-left text-white">
                          Responsável
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-1 align-top">
                          <Textarea
                            name="justification"
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            disabled={isSubmittingManual}
                            className="min-h-20 w-full resize-none border-0 p-1 focus-visible:ring-1"
                          />
                          {formState?.errors?.justification && (
                            <p className="text-destructive p-1 text-xs">
                              {formState.errors.justification[0]}
                            </p>
                          )}
                        </td>
                        <td className="border p-1 align-top">
                          <Textarea
                            name="correctiveAction"
                            value={correctiveAction}
                            onChange={(e) =>
                              setCorrectiveAction(e.target.value)
                            }
                            disabled={isSubmittingManual}
                            className="min-h-20 w-full resize-none border-0 p-1 focus-visible:ring-1"
                          />
                          {formState?.errors?.correctiveAction && (
                            <p className="text-destructive p-1 text-xs">
                              {formState.errors.correctiveAction[0]}
                            </p>
                          )}
                        </td>
                        <td className="border p-1 align-top">
                          <Textarea
                            name="responsible"
                            value={responsible}
                            onChange={(e) => setResponsible(e.target.value)}
                            disabled={isSubmittingManual}
                            className="min-h-20 w-full resize-none border-0 p-1 focus-visible:ring-1"
                          />
                          {formState?.errors?.responsible && (
                            <p className="text-destructive p-1 text-xs">
                              {formState.errors.responsible[0]}
                            </p>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmittingManual}
              className="w-full bg-green-500 cursor-pointer hover:bg-green-600 md:w-36"
            >
              {isSubmittingManual && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmittingManual ? 'Salvando...' : 'Salvar'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ClientIndicatorPage;
