'use client';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  startTransition
} from 'react';
import { useActionState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { useSearchParams } from 'next/navigation';
import { IndicatorGrade } from '@prisma/client';
import { useAppContext } from '@/context/AppContext';
import { isReadOnlyIndicator } from '@/lib/permissions';
import { ExistingFile } from '@/types/indicator-types';
import { useIndicatorData } from '@/hooks/useIndicatorData';
// import { uploadFileToMinio } from '@/services/uploadFile';
import { uploadToCloudinary } from '@/services/uploadToCloudinary';
import BackButton from '../back-button';

type UploadedFileInfo = {
  storageKey: string;
  externalUrl: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
};

type LinkItem = { id?: string; text: string; url: string };

type CriterionRow = { concept: string; criterion: string };
type ApiIndicatorData = {
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

const ClientIndicatorPage = ({
  slug,
  indicadorCode,
  dimensionId}: {
  slug: string;
  indicadorCode: string;
  dimensionId: string;
  initialIndicator?: ApiIndicatorData;
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

  const fallbackHref = `/courses/${courseSlug}/dimensions/${dimensionId}${
      year ? `?year=${year}` : ''
    }`;

  const [grade, setGrade] = useState<IndicatorGrade>(IndicatorGrade.NSA);
  const [nsaAuto, setNsaAuto] = useState<boolean>(false);
  const [justification, setJustification] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [responsible, setResponsible] = useState('');
  const [evidenceStates, setEvidenceStates] = useState<
    Record<
      string,
      { links: string[]; filesToUpload: File[]; linkItems?: LinkItem[] }
    >
  >({});

  const [lastUploadedFiles, setLastUploadedFiles] = useState<
    Record<string, ExistingFile[]>
  >({});

  const pendingUploadedFilesRef = useRef<Record<string, UploadedFileInfo[]>>(
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Server Action state
  const initialState: SaveIndicatorState = { errors: {}, success: false };
  const [formState, formAction] = useActionState(
    saveIndicatorEvaluation,
    initialState
  );
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const queryClient = useQueryClient();
  // Define read-only usando utilidade compartilhada (ADMIN/COORDINATOR do curso podem editar)
  const { role, userId, courseCoordinatorId } = useAppContext();
  const readOnly = isReadOnlyIndicator({
    role,
    userId: userId ?? null,
    courseCoordinatorId
  });

  const {
    data: apiData,
    isLoading: queryLoading,
    refetch,
    error: queryError
  } = useIndicatorData(courseSlug, indicatorCode, year);

  const initKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!apiData) return;
    const key = `${apiData.indicator.id}-${year ?? 'na'}`;
    if (initKeyRef.current === key) return;
    initKeyRef.current = key;

    setGrade(apiData.evaluation?.grade || IndicatorGrade.NSA);
    setNsaAuto(apiData.evaluation?.nsaApplicable === false);
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
  }, [apiData, year]);

  useEffect(() => {
    if (formState?.errors?._form)
      toast.error(formState.errors._form.join(', '));
    if (formState?.success) {
      toast.success('Avaliação salva com sucesso!');

      const uploadedMap: Record<string, ExistingFile[]> = {};
      Object.entries(pendingUploadedFilesRef.current).forEach(([slug, arr]) => {
        uploadedMap[slug] = arr.map((fi) => ({
          fileName: fi.fileName,
          sizeBytes: fi.sizeBytes,
          url: fi.externalUrl,
          publicId: fi.storageKey
        }));
      });
      if (Object.keys(uploadedMap).length > 0) {
        setLastUploadedFiles(uploadedMap);
        setEvidenceStates((prev) => {
          const next: typeof prev = {};
          Object.entries(prev).forEach(([slug, st]) => {
            next[slug] = { ...st, filesToUpload: [] };
          });
          return next;
        });
      }
    }
    setIsSubmittingManual(false);
  }, [formState]);

  useEffect(() => {
    if (formState?.success) {
      refetch();
      queryClient.invalidateQueries({
        queryKey: ['dimension', courseSlug, dimensionId]
      });
      try {
        window.dispatchEvent(
          new CustomEvent('alerts:refresh', {
            detail: { courseId: courseSlug, year }
          })
        );
      } catch {}
    }
  }, [formState?.success, refetch, queryClient, courseSlug, dimensionId, year]);

  const handleEvidenceStateChange = useCallback(
    (
      slug: string,
      state: { links: string[]; filesToUpload: File[]; linkItems?: LinkItem[] }
    ) => {
      setEvidenceStates((prev) => {
        const prevState = prev[slug];
        const isSame = (() => {
          if (!prevState) return false;
          const sameLinks =
            prevState.links.length === state.links.length &&
            prevState.links.every((v, i) => v === state.links[i]);
          const sameFiles =
            prevState.filesToUpload.length === state.filesToUpload.length;
          const prevItems = prevState.linkItems || [];
          const nextItems = state.linkItems || [];
          const sameItems =
            prevItems.length === nextItems.length &&
            prevItems.every(
              (v, i) =>
                v.text === nextItems[i]?.text && v.url === nextItems[i]?.url
            );
          return sameLinks && sameFiles && sameItems;
        })();
        if (isSame) return prev;
        return { ...prev, [slug]: state };
      });
    },
    []
  );

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !apiData ||
      !apiData.course ||
      !apiData.indicator ||
      !year ||
      isSubmittingManual
    ) {
      return;
    }

    setIsSubmittingManual(true);

    const formData = new FormData();

    const courseId = apiData.course.id;
    const indicatorDefId = apiData.indicator.id;
    const courseSlug = apiData.course.slug;

    formData.append('courseId', courseId);
    formData.append('indicatorDefId', indicatorDefId);
    formData.append('courseSlug', courseSlug);
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
      if (state.filesToUpload.length === 0) continue;

      filesUploadedInfo[slug] = [];

      for (const file of state.filesToUpload) {
        const folder = `sinaes-evidence/${courseSlug}/${year}/${slug}`;

        const promise = uploadToCloudinary(file, folder)
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
          });

        uploadPromises.push(promise);
      }
    }

    try {
      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      if (uploadFailed) {
        toast.error(
          'Alguns arquivos falharam ao enviar. Verifique e tente novamente.'
        );
        setIsSubmittingManual(false);
        return;
      }

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
        pendingUploadedFilesRef.current = filesUploadedInfo;
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
  if (!apiData) {
    return (
      <div className="p-8 text-center">
        Erro ao carregar dados essenciais do curso ou indicador.
      </div>
    );
  }

  const criterions: CriterionRow[] = Array.isArray(
    apiData.indicator.criteriaTable
  )
    ? (apiData.indicator.criteriaTable as CriterionRow[])
    : [];

  return (
    <div className="space-y-8 p-6 md:p-8">
      <h1 className="text-3xl font-bold">
        Indicador {apiData.indicator.code}
        <span className="text-muted-foreground font-normal">
          {' '}
          — {apiData.indicator.name}
        </span>
      </h1>

      <BackButton url={fallbackHref} label="Voltar para Dimensão" />

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
        <input type="hidden" name="courseId" value={apiData.course.id} />
        <input type="hidden" name="courseSlug" value={apiData.course.slug} />
        <input
          type="hidden"
          name="indicatorDefId"
          value={apiData.indicator.id}
        />
        <input type="hidden" name="evaluationYear" value={year ?? ''} />

        <Card>
          <CardHeader>
            <CardTitle>Evidências e Documentos Comprobatórios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 rounded-md border p-4">
              {apiData.requiredEvidences.length > 0 ? (
                apiData.requiredEvidences.every(
                  (ev) => ev.submission == null
                ) && readOnly ? (
                  <p className="text-muted-foreground text-sm">
                    Nenhum documento enviado.
                  </p>
                ) : (
                  apiData.requiredEvidences
                    .filter((evidence) => {
                      if (readOnly) {
                        const hasFiles =
                          Array.isArray(evidence.submission?.files) &&
                          evidence.submission!.files.length > 0;
                        const hasFolderUrls =
                          Array.isArray(evidence.submission?.folderUrls) &&
                          evidence.submission!.folderUrls!.length > 0;
                        const hasLinks =
                          Array.isArray(evidence.submission?.links) &&
                          evidence.submission!.links!.length > 0;
                        return hasFiles || hasFolderUrls || hasLinks;
                      }
                      return true;
                    })
                    .map((evidence) => (
                      <div
                        key={evidence.id}
                        className="space-y-2 border-b pb-4 last:border-b-0"
                      >
                        <Label className="font-semibold">
                          {evidence.title}
                        </Label>
                        <FileUpload
                          evidenceSlug={evidence.slug}
                          initialLinks={
                            Array.isArray(evidence.submission?.folderUrls)
                              ? evidence.submission!.folderUrls!
                              : []
                          }
                          initialLinkItems={(() => {
                            const links = apiData?.requiredEvidences.find(
                              (ev) => ev.id === evidence.id
                            )?.submission?.links;
                            return links;
                          })()}
                          initialFiles={evidence.submission?.files || []}
                          onStateChange={handleEvidenceStateChange}
                          isLoading={isSubmittingManual}
                          courseId={apiData.course.id}
                          requirementId={evidence.id}
                          onLinkSaved={() => refetch()}
                          courseSlug={courseSlug}
                          indicatorCode={indicatorCode}
                          evaluationYear={year}
                          newlySavedFiles={lastUploadedFiles[evidence.slug]}
                          readOnly={readOnly}
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
                )
              ) : (
                <p className="text-muted-foreground text-sm">
                  Nenhum documento.
                </p>
              )}
            </div>

            {!readOnly && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>
                    Nota atribuída <span className="text-destructive">*</span>
                  </span>
                  {nsaAuto && grade === 'NSA' && (
                    <Badge
                      variant="secondary"
                      title="A nota foi ajustada automaticamente por estar marcada como Não Se Aplica na dimensão."
                    >
                      NSA automática
                    </Badge>
                  )}
                </Label>
                <Select
                  key={`${grade}-${apiData?.evaluation?.grade || 'loading'}`}
                  name="grade"
                  value={grade}
                  onValueChange={(v) => setGrade(v as IndicatorGrade)}
                  required
                  disabled={isSubmittingManual || nsaAuto}
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
            )}

            {!readOnly && ['G1', 'G2', 'G3', 'G4'].includes(grade) && (
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
                    <thead className="bg-green-600 text-white">
                      <tr>
                        <th className="border p-2 text-left font-semibold">
                          Justificativa
                        </th>
                        <th className="border p-2 text-left font-semibold">
                          Ação corretiva
                        </th>
                        <th className="border p-2 text-left font-semibold">
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

            {!readOnly && (
              <Button
                type="submit"
                disabled={isSubmittingManual}
                className="w-full cursor-pointer bg-green-600 hover:bg-green-700 md:w-36"
              >
                {isSubmittingManual && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmittingManual ? 'Salvando...' : 'Salvar'}
              </Button>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ClientIndicatorPage;
