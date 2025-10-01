'use client';

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
import { Input } from '@/components/ui/input';

const criteriaByIndicator: Record<
  string,
  { concept: string; criterion: string }[]
> = {
  '3.1': [
    {
      concept: '1',
      criterion: 'Não há espaço de trabalho para docentes em tempo integral.'
    },
    {
      concept: '2',
      criterion: 'Há espaço de trabalho, porém inadequado ou insuficiente.'
    },
    {
      concept: '3',
      criterion:
        'Há espaço de trabalho adequado para docentes em tempo integral.'
    },
    {
      concept: '4',
      criterion:
        'Há espaço de trabalho adequado, equipado e em quantidade compatível com a demanda.'
    },
    {
      concept: '5',
      criterion:
        'O espaço de trabalho é exemplar, com recursos adicionais que favorecem a qualidade das atividades docentes.'
    }
  ],
  '3.2': [
    { concept: '1', criterion: 'Exemplo de critério para 3.2 - conceito 1' },
    { concept: '2', criterion: '...' },
    { concept: '3', criterion: '...' },
    { concept: '4', criterion: '...' },
    { concept: '5', criterion: '...' }
  ]
};

const IndicatorPage = () => {
  const params = useParams();
  const code = params.code as string;

  const criterions = criteriaByIndicator[code] || [];

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">Indicador {code}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Critérios de Avaliação</CardTitle>
        </CardHeader>
        <CardContent>
          {criterions.length > 0 ? (
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
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
            <Label>Nota</Label>
            <Select>
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
            <Input type="file" />
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea placeholder="Descreva as evidências ou observações para este indicador" />
          </div>

          <Button>Salvar</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndicatorPage;
