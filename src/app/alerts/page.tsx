"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const alerts = [
  {
    dimension: 'Dimensão 1',
    text: 'Preencher indicador 1.6 - Metodologia',
    url: '/dimension-1/indicator/1.6'
  },
  {
    dimension: 'Dimensão 2',
    text: 'Atualizar evidências do indicador 2.3 - Coordenador',
    url: '/dimension-2/indicator/2.3'
  },
  {
    dimension: 'Dimensão 3',
    text: 'Falta documento comprobatório do indicador 3.18',
    url: '/dimension-3/indicator/3.18'
  }
];

export default function AlertsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">Pendências e Alertas</h1>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pendências</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((a) => (
              <div
                key={a.url}
                className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50 hover:cursor-pointer"
                onClick={() => router.push(a.url)}
              >
                <div>
                  <div className="font-medium">{a.dimension}</div>
                  <div className="text-sm text-muted-foreground">{a.text}</div>
                </div>
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => router.push(a.url)}
                    className="cursor-pointer"
                  >
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
