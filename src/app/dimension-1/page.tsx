'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';
import DownloadIcon from '@/icons/DownloadIcon';

const indicators = [
  {
    code: '1.1',
    name: 'Políticas institucionais no âmbito do curso',
    grade: '3',
    status: 'Concluído',
    lastUpdate: '2025-06-01'
  },
  {
    code: '1.2',
    name: 'Objetivos do curso',
    grade: '4',
    status: 'Em revisão',
    lastUpdate: '2025-05-28'
  },
  {
    code: '1.3',
    name: 'Perfil profissional do egresso',
    grade: '3',
    status: 'Pendente',
    lastUpdate: '2025-05-20'
  },
  {
    code: '1.4',
    name: 'Estrutura curricular',
    grade: 'NSA',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '1.5',
    name: 'Conteúdos curriculares',
    grade: '5',
    status: 'Concluído',
    lastUpdate: '2025-05-30'
  },
  {
    code: '1.6',
    name: 'Metodologia',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.7',
    name: 'Estágio curricular supervisionado',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.8',
    name: 'Estágio curricular supervisionado – relação com a rede de escolas da educação básica',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.9',
    name: 'Estágio curricular supervisionado – relação teoria e prática',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.10',
    name: 'Atividades complementares',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.11',
    name: 'Trabalhos de Conclusão de Curso (TCC)',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.12',
    name: 'Apoio ao discente',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.13',
    name: 'Gestão do curso e os processos de avaliação interna e externa',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.14',
    name: 'Atividades de tutoria',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.15',
    name: 'Conhecimentos, habilidades e atitudes necessárias às atividades de tutoria',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.16',
    name: 'Tecnologias de Informação e comunicação (TIC) no processo ensino-aprendizagem',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.17',
    name: 'Ambiente Virtual de Aprendizagem (AVA)',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.18',
    name: 'Material didático',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.19',
    name: 'Procedimentos de acompanhamento e de avaliação dos processos de ensino-aprendizagem',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.20',
    name: 'Número de vagas',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.21',
    name: 'Integração com as redes públicas de ensino',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.22',
    name: 'Integração do curso com o sistema local e regional de saúde (SUS)',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.23',
    name: 'Atividades práticas de ensino para áreas da saúde',
    grade: '2',
    status: 'Em revisão',
    lastUpdate: '2025-06-02'
  },
  {
    code: '1.24',
    name: 'Atividades práticas de ensino para licenciaturas',
    grade: 'NSA',
    status: 'Pendente',
    lastUpdate: '-'
  }
];

const Dimension1Page = () => {
  const router = useRouter();
  const [nsaChecked, setNsaChecked] = useState<Record<string, boolean>>(() => {
    const allowed = new Set([
      '1.7',
      '1.8',
      '1.9',
      '1.10',
      '1.11',
      '1.14',
      '1.15',
      '1.17',
      '1.18',
      '1.21',
      '1.22',
      '1.23',
      '1.24'
    ]);
    const init: Record<string, boolean> = {};
    indicators.forEach((i) => {
      if (allowed.has(i.code)) init[i.code] = false;
    });
    return init;
  });

  const handleEdit = (code: string) => {
    router.push(`/dimension-1/indicator/${code}`);
  };

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">
        Dimensão 1 - Organização Didático-Pedagógica
      </h1>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Indicadores da Dimensão 1</CardTitle>
          <Button asChild variant="outline" className="cursor-pointer">
            <a
              href="/assets/pdf/pdf-1.pdf"
              download
              aria-label="Baixar Manual de Instruções da Dimensão 1"
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
                {indicators.map((indicator) => (
                  <tr key={indicator.code} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{indicator.code}</td>
                    <td className="border px-4 py-2">{indicator.name}</td>
                    <td className="border px-4 py-2 text-center">
                      {indicator.grade}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <StatusBadge status={indicator.status} />
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {indicator.lastUpdate}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={() => handleEdit(indicator.code)}
                        disabled={(() => {
                          const allowed = new Set([
                            '1.7',
                            '1.8',
                            '1.9',
                            '1.10',
                            '1.11',
                            '1.14',
                            '1.15',
                            '1.17',
                            '1.18',
                            '1.21',
                            '1.22',
                            '1.23',
                            '1.24'
                          ]);
                          return allowed.has(indicator.code)
                            ? !nsaChecked[indicator.code]
                            : false;
                        })()}
                      >
                        Editar
                      </Button>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {/* NSA checkbox only for allowed indicators */}
                      {(() => {
                        const allowed = new Set([
                          '1.7',
                          '1.8',
                          '1.9',
                          '1.10',
                          '1.11',
                          '1.14',
                          '1.15',
                          '1.17',
                          '1.18',
                          '1.21',
                          '1.22',
                          '1.23',
                          '1.24'
                        ]);
                        const isAllowed = allowed.has(indicator.code);
                        const checked = !!nsaChecked[indicator.code];
                        return isAllowed ? (
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setNsaChecked((prev) => ({
                                ...prev,
                                [indicator.code]: !prev[indicator.code]
                              }))
                            }
                            aria-label={`Marcar NSA ${indicator.code}`}
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

export default Dimension1Page;
