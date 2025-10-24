'use client';
import * as React from 'react';

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
import { useEffect, useState } from 'react';
import { FileUpload } from '@/components/file-upload';

const IndicatorGrade = {
  G1: 'G1',
  G2: 'G2',
  G3: 'G3',
  G4: 'G4',
  G5: 'G5',
  NSA: 'NSA'
};

type CriterionRow = { concept: string; criterion: string };
type EvidenceFileItem = {
  fileName: string;
  externalUrl?: string | null;
  sizeBytes?: number | null;
};

type ApiIndicatorData = {
  indicator: {
    code: string;
    name: string;
    criteriaTable: unknown;
  };
  evaluation: {
    grade: keyof typeof IndicatorGrade;
    justification: string | null;
    correctiveAction: string | null;
    responsible: string | null;
  } | null;
  requiredEvidences: {
    id: string;
    slug: string;
    title: string;
    submission: {
      folderUrl: string | null;
      files: EvidenceFileItem[];
    } | null;
  }[];
};

const IndicatorPage = () => {
  const params = { slug: 'ads', indicatorCode: '1.1' };
  const searchParams = {
    get: (key: string) => (key === 'year' ? '2024' : null)
  };

  const { slug: courseId, indicatorCode } = params;
  const year = searchParams.get('year');

  const [data, setData] = useState<ApiIndicatorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [grade, setGrade] = useState<string>('');

  useEffect(() => {
    if (!courseId || !indicatorCode || !year) {
      setError('Parâmetros inválidos na URL.');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      console.log('fetchData');

      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/courses/${courseId}/indicators/${indicatorCode}?year=${year}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
              'Não foi possível carregar os dados do indicador.'
          );
        }
        const result: ApiIndicatorData = await response.json();
        setData(result);
        setGrade(result.evaluation?.grade || '');
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.'
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [courseId, indicatorCode, year]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Carregando indicador...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive p-8 text-center">{error}</div>;
  }

  if (!data) {
    return (
      <div className="text-muted-foreground p-8 text-center">
        Nenhum dado encontrado para este indicador.
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
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-green-600">
              <tr>
                <th className="border px-4 py-2 text-center text-sm font-semibold text-white">
                  Nota
                </th>
                <th className="border px-4 py-2 text-left text-sm font-semibold text-white">
                  Critério de Análise
                </th>
              </tr>
            </thead>
            <tbody>
              {criterions.map((item: CriterionRow) => (
                <tr key={item.concept}>
                  <td className="border px-4 py-2 text-center font-semibold">
                    {item.concept}
                  </td>
                  <td className="border px-4 py-2">{item.criterion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evidências e Documentos Comprobatórios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 rounded-md border p-4">
            {data.requiredEvidences.length > 0 ? (
              data.requiredEvidences.map((evidence) => (
                <div key={evidence.id} className="space-y-2">
                  <Label className="font-semibold">{evidence.title}</Label>
                  <FileUpload
                    initialLink={evidence.submission?.folderUrl || ''}
                    initialFiles={evidence.submission?.files || []}
                    onFilesChange={(files) =>
                      console.log('Files changed for', evidence.slug, files)
                    }
                    onLinkChange={(link) =>
                      console.log('Link changed for', evidence.slug, link)
                    }
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                Nenhum documento comprobatório específico é exigido para este
                indicador.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Nota atribuída</Label>
            <Select value={grade} onValueChange={setGrade}>
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
                      <th className="border px-3 py-2 text-left font-semibold text-white">
                        Justificativa da nota
                      </th>
                      <th className="border px-3 py-2 text-left font-semibold text-white">
                        Ação corretiva
                      </th>
                      <th className="border px-3 py-2 text-left font-semibold text-white">
                        Responsável
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 align-top">
                        <Textarea
                          name="justification"
                          defaultValue={data.evaluation?.justification || ''}
                          className="min-h-20 w-full resize-none"
                        />
                      </td>
                      <td className="border p-2 align-top">
                        <Textarea
                          name="correctiveAction"
                          defaultValue={data.evaluation?.correctiveAction || ''}
                          className="min-h-20 w-full resize-none"
                        />
                      </td>
                      <td className="border p-2 align-top">
                        <Textarea
                          name="responsible"
                          defaultValue={data.evaluation?.responsible || ''}
                          className="min-h-20 w-full resize-none"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <Button className="w-full bg-green-600 hover:bg-green-700 md:w-36">
            Salvar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndicatorPage;
