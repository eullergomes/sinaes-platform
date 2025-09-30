'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import DownloadIcon from '@/icons/DownloadIcon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';

const indicators = [
  {
    code: '2.1',
    name: 'Núcleo Docente Estruturante – NDE',
    grade: '4',
    status: 'Concluído',
    lastUpdate: '2025-05-29'
  },
  {
    code: '2.2',
    name: 'Equipe multidisciplinar',
    grade: '3',
    status: 'Em revisão',
    lastUpdate: '2025-05-25'
  },
  {
    code: '2.3',
    name: 'Atuação do coordenador',
    grade: '2',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '2.4',
    name: 'Regime de trabalho do coordenador de curso',
    grade: '5',
    status: 'Concluído',
    lastUpdate: '2025-05-30'
  },
  {
    code: '2.5',
    name: 'Corpo docente: titulação',
    grade: '4',
    status: 'Concluído',
    lastUpdate: '2025-06-01'
  },
  {
    code: '2.6',
    name: 'Regime de trabalho do corpo docente do curso',
    grade: '3',
    status: 'Em revisão',
    lastUpdate: '2025-05-28'
  },
  {
    code: '2.7',
    name: 'Experiência profissional do docente',
    grade: 'NSA',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '2.8',
    name: 'Experiência no exercício da docência na educação básica',
    grade: '5',
    status: 'Concluído',
    lastUpdate: '2025-06-02'
  },
  {
    code: '2.9',
    name: 'Experiência no exercício da docência superior',
    grade: '4',
    status: 'Concluído',
    lastUpdate: '2025-05-27'
  },
  {
    code: '2.10',
    name: 'Experiência no exercício da docência na educação a distância',
    grade: 'NSA',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '2.11',
    name: 'Experiência no exercício da tutoria na educação a distância',
    grade: 'NSA',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '2.12',
    name: 'Atuação do colegiado de curso ou equivalente',
    grade: '3',
    status: 'Em revisão',
    lastUpdate: '2025-05-26'
  },
  {
    code: '2.13',
    name: 'Titulação e formação do corpo de tutores do curso',
    grade: '2',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '2.14',
    name: 'Experiência do corpo de tutores em educação a distância',
    grade: 'NSA',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '2.15',
    name: 'Interação entre tutores (presenciais – quando for o caso – e a distância), docentes e coordenadores de curso a distância',
    grade: '4',
    status: 'Concluído',
    lastUpdate: '2025-06-03'
  },
  {
    code: '2.16',
    name: 'Produção científica, cultural, artística ou tecnológica',
    grade: '5',
    status: 'Concluído',
    lastUpdate: '2025-06-02'
  }
];

const Dimension2Page = () => {
  const router = useRouter();
  const [nsaChecked, setNsaChecked] = useState<Record<string, boolean>>(() => {
    const allowed = new Set([
      '2.2',
      '2.7',
      '2.8',
      '2.10',
      '2.11',
      '2.13',
      '2.14',
      '2.15'
    ]);
    const init: Record<string, boolean> = {};
    indicators.forEach((i) => {
      if (allowed.has(i.code)) init[i.code] = false;
    });
    return init;
  });

  const handleEdit = (code: string) => {
    router.push(`/dimension-2/indicator/${code}`);
  };

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">
        Dimensão 2 - Corpo Docente e Tutorial
      </h1>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Indicadores da Dimensão 2</CardTitle>
          <Button asChild variant="outline" className="cursor-pointer">
            <a
              href="/assets/pdf/pdf-2.pdf"
              download
              aria-label="Baixar Manual de Instruções da Dimensão 2"
              className="inline-flex items-center gap-2"
            >
              <DownloadIcon width={16} height={16} />
              Manual de Instruções
            </a>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Código</th>
                  <th className="border px-4 py-2 text-left">Indicador</th>
                  <th className="border px-4 py-2 text-center">Nota atual</th>
                  <th className="border px-4 py-2 text-center">Status</th>
                  <th className="border px-4 py-2 text-center">
                    Última Atualização
                  </th>
                  <th className="border px-4 py-2 text-center">Ações</th>
                  <th className="border px-4 py-2 text-center">NSA</th>
                </tr>
              </thead>
              <tbody>
                {indicators.map((indicador) => (
                  <tr key={indicador.code} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{indicador.code}</td>
                    <td className="border px-4 py-2">{indicador.name}</td>
                    <td className="border px-4 py-2 text-center">
                      {indicador.grade}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <StatusBadge status={indicador.status} />
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {indicador.lastUpdate}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => handleEdit(indicador.code)}
                        disabled={(() => {
                          const allowed = new Set([
                            '2.2',
                            '2.7',
                            '2.8',
                            '2.10',
                            '2.11',
                            '2.13',
                            '2.14',
                            '2.15'
                          ]);
                          return allowed.has(indicador.code)
                            ? !nsaChecked[indicador.code]
                            : false;
                        })()}
                      >
                        Editar
                      </Button>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {(() => {
                        const allowed = new Set([
                          '2.2',
                          '2.7',
                          '2.8',
                          '2.10',
                          '2.11',
                          '2.13',
                          '2.14',
                          '2.15'
                        ]);
                        const isAllowed = allowed.has(indicador.code);
                        const checked = !!nsaChecked[indicador.code];
                        return isAllowed ? (
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setNsaChecked((prev) => ({
                                ...prev,
                                [indicador.code]: !prev[indicador.code]
                              }))
                            }
                            aria-label={`Marcar NSA ${indicador.code}`}
                          />
                        ) : (
                          <span className="text-gray-400">—</span>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dimension2Page;
