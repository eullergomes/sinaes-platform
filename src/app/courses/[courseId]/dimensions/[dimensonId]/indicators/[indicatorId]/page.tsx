'use client';
import * as React from 'react';

import { useParams } from 'next/navigation';
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
import { criteriaByIndicator } from '@/app/constants/criteriaByIndicator';
import { indicators } from '@/app/constants/indicators';
import { FileUpload } from '@/components/file-upload';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const IndicadorPage = () => {
  const params = useParams() as {
    courseId?: string;
    dimensonId?: string;
    indicatorId?: string;
  };
  const code = (params?.indicatorId ?? '') as string;

  const criterions = criteriaByIndicator[code] || [];

  console.log('IndicadorPage: params=', params, 'criterions=', criterions);

  const [grade, setGrade] = React.useState<string>('');

  const indicatorMeta = React.useMemo(() => {
    return indicators.find((i) => i.code === code);
  }, [code]);

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">
        Indicador {code}
        {indicatorMeta?.name ? (
          <span className="text-muted-foreground font-normal">
            {' '}
            — {indicatorMeta.name}
          </span>
        ) : null}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Critérios de Avaliação</CardTitle>
        </CardHeader>
        <CardContent>
          {criterions.length > 0 ? (
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-green-600">
                <tr>
                  <th className="border px-4 py-2 text-center">Conceito</th>
                  <th className="border px-4 py-2 text-left">
                    Critério de Análise
                  </th>
                </tr>
              </thead>
              <tbody>
                {criterions.map((item) => (
                  <tr key={item.concept}>
                    <td className="border px-4 py-2 text-center font-semibold">
                      {item.concept}
                    </td>
                    <td className="border px-4 py-2">{item.criterion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">
              Critérios não cadastrados para este indicador.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Atribuição de Nota e Upload de Evidência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nota atribuída</Label>
            <Select value={grade} onValueChange={(v) => setGrade(v)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NSA">NSA</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Upload de documento comprobatório</Label>
            <FileUpload
              onFilesChange={(files) => console.log(files)}
              onLinkChange={(link) => console.log(link)}
            />
          </div>

          {['1', '2', '3', '4'].includes(grade) && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-base font-semibold">
                  Plano de ação:
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="O que deve ser feito para atingir nota máxima"
                      className="text-muted-foreground hover:text-foreground inline-flex h-5 w-5 items-center justify-center rounded"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    O que deve ser feito para atingir nota máxima
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="overflow-x-auto">
                {/* 1) layout fixo + colunas com largura definida */}
                <table className="min-w-full table-fixed border border-gray-300 text-sm">
                  <colgroup>
                    <col className="w-1/3" /> {/* Justificativa */}
                    <col className="w-1/3" /> {/* Ação corretiva */}
                    <col className="w-1/3" /> {/* Responsável */}
                  </colgroup>

                  <thead className="bg-green-600">
                    <tr>
                      <th className="border px-3 py-2 text-left">
                        Justificativa da nota
                      </th>
                      <th className="border px-3 py-2 text-left">
                        Ação corretiva
                      </th>
                      <th className="border px-3 py-2 text-left">
                        Responsável
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border px-3 py-2 align-top">
                        <Textarea
                          placeholder="Descreva a justificativa da nota"
                          // 2) preencher a célula e impedir resize horizontal
                          className="min-h-20 w-full resize-none"
                          // 3) garantir wrap dentro do textarea (inclui palavras longas)
                          wrap="soft"
                          style={{
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-word'
                          }}
                        />
                      </td>

                      <td className="border px-3 py-2 align-top">
                        <Textarea
                          placeholder="Detalhe a ação corretiva para atingir a nota máxima"
                          className="min-h-20 w-full resize-none"
                          wrap="soft"
                          style={{
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-word'
                          }}
                        />
                      </td>

                      <td className="border px-3 py-2 align-top">
                        <Textarea
                          placeholder="Indique o responsável pela ação"
                          className="min-h-20 w-full resize-none"
                          wrap="soft"
                          style={{
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-word'
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Button>Salvar</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndicadorPage;
