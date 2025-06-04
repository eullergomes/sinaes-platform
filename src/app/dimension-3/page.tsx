'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';

const indicators = [
  {
    code: '3.1',
    name: 'Espaço de trabalho para docentes em tempo integral',
    grade: '4',
    status: 'Concluído',
    lastUpdate: '2025-05-28'
  },
  {
    code: '3.2',
    name: 'Espaço de trabalho para o coordenador',
    grade: '5',
    status: 'Concluído',
    lastUpdate: '2025-05-29'
  },
  {
    code: '3.3',
    name: 'Sala coletiva de professores',
    grade: '3',
    status: 'Em revisão',
    lastUpdate: '2025-05-30'
  },
  {
    code: '3.4',
    name: 'Salas de aula',
    grade: '2',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '3.5',
    name: 'Acesso dos alunos a equipamentos de informática',
    grade: 'NSA',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '3.6',
    name: 'Bibliografia básica por Unidade Curricular (UC)',
    grade: '4',
    status: 'Concluído',
    lastUpdate: '2025-05-27'
  },
  {
    code: '3.7',
    name: 'Bibliografia complementar por Unidade Curricular (UC)',
    grade: '5',
    status: 'Concluído',
    lastUpdate: '2025-06-01'
  },
  {
    code: '3.8',
    name: 'Laboratórios didáticos de formação básica',
    grade: '3',
    status: 'Em revisão',
    lastUpdate: '2025-05-25'
  },
  {
    code: '3.9',
    name: 'Laboratórios didáticos de formação específica',
    grade: 'NSA',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '3.10',
    name: 'Laboratórios de ensino para a área de saúde',
    grade: '4',
    status: 'Concluído',
    lastUpdate: '2025-06-02'
  },
  {
    code: '3.11',
    name: 'Laboratórios de habilidades',
    grade: '2',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '3.12',
    name: 'Unidades hospitalares e complexo assistencial conveniados',
    grade: '5',
    status: 'Concluído',
    lastUpdate: '2025-06-03'
  },
  {
    code: '3.13',
    name: 'Biotérios',
    grade: '3',
    status: 'Em revisão',
    lastUpdate: '2025-05-26'
  },
  {
    code: '3.14',
    name: 'Processo de controle de produção ou distribuição de material didático (logística)',
    grade: '4',
    status: 'Concluído',
    lastUpdate: '2025-05-31'
  },
  {
    code: '3.15',
    name: 'Núcleo de práticas jurídicas: atividades básicas e arbitragem, negociação, conciliação, mediação e atividades jurídicas reais',
    grade: 'NSA',
    status: 'Pendente',
    lastUpdate: '-'
  },
  {
    code: '3.16',
    name: 'Comitê de Ética em Pesquisa (CEP)',
    grade: '3',
    status: 'Em revisão',
    lastUpdate: '2025-05-29'
  },
  {
    code: '3.17',
    name: 'Comitê de Ética na Utilização de Animais (CEUA)',
    grade: '4',
    status: 'Concluído',
    lastUpdate: '2025-06-01'
  },
  {
    code: '3.18',
    name: 'Ambientes profissionais vinculados ao curso',
    grade: 'NSA',
    status: 'Pendente',
    lastUpdate: '-'
  }
];

const Dimension3Page = () => {
  const router = useRouter();

  const handleEdit = (code: string) => {
    router.push(`/dimension-3/indicator/${code}`);
  };

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">Dimensão 3 - Infraestrutura</h1>

      <Card>
        <CardHeader>
          <CardTitle>Indicadores da Dimensão 3</CardTitle>
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
                      >
                        Editar
                      </Button>
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

export default Dimension3Page;
