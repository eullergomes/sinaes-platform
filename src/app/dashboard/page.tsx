"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  {
    dimension: 'Organização Didático-Pedagógica',
    grade: 3.5
  },
  {
    dimension: 'Corpo Docente e Tutorial',
    grade: 4.0
  },
  {
    dimension: 'Infraestrutura',
    grade: 3.0
  }
];

const DashboardPage = () => {
  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">Dashboard - Monitoramento SINAES</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card
          className="transition-shadow duration-200 hover:cursor-pointer hover:shadow-lg"
          onClick={() => (window.location.href = '/dimension-1')}
        >
          <CardHeader>
            <CardTitle>Dimensão 1</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              Organização Didático-Pedagógica
            </p>
            <p className="mt-2 text-lg">Nota atual: 3.5</p>
          </CardContent>
        </Card>

        <Card
          className="transition-shadow duration-200 hover:cursor-pointer hover:shadow-lg"
          onClick={() => (window.location.href = '/dimension-2')}
        >
          <CardHeader>
            <CardTitle>Dimensão 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">Corpo Docente e Tutorial</p>
            <p className="mt-2 text-lg">Nota atual: 4.0</p>
          </CardContent>
        </Card>

        <Card
          className="transition-shadow duration-200 hover:cursor-pointer hover:shadow-lg"
          onClick={() => (window.location.href = '/dimension-3')}
        >
          <CardHeader>
            <CardTitle>Dimensão 3</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">Infraestrutura</p>
            <p className="mt-2 text-lg">Nota atual: 3.0</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Gráfico de Radar - Indicadores Globais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dimension" />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} />
                  <Tooltip />
                  <Radar
                    name="grade"
                    dataKey="grade"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Pendências e Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5">
              <li>Preencher indicador 1.6 - Metodologia</li>
              <li>
                Atualizar evidências do indicador 2.3 - Atuação do coordenador
              </li>
              <li>Falta documento comprobatório do indicador 3.18</li>
            </ul>
            <Button className="mt-4">Ver todos</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
