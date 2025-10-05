'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

type AlertItem = {
  dimensionId: '1' | '2' | '3';
  dimensionLabel: string;
  text: string;
  code: string;
};

const alerts: AlertItem[] = [
  {
    dimensionId: '1',
    dimensionLabel: 'Dimensão 1',
    text: 'Preencher indicador 1.6 - Metodologia',
    code: '1.6',
  },
  {
    dimensionId: '2',
    dimensionLabel: 'Dimensão 2',
    text: 'Atualizar evidências do indicador 2.3 - Coordenador',
    code: '2.3',
  },
  {
    dimensionId: '3',
    dimensionLabel: 'Dimensão 3',
    text: 'Falta documento comprobatório do indicador 3.18',
    code: '3.18',
  },
];

function extractCourseId(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  const i = parts.indexOf('courses');
  if (i >= 0 && parts[i + 1]) return decodeURIComponent(parts[i + 1]);
  return null;
}

export default function AlertsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const courseId = extractCourseId(pathname);

  const buildUrl = (a: AlertItem) => {
    if (!courseId) return '/courses';
    return `/courses/${courseId}/dimensions/${a.dimensionId}/indicators/${a.code}`;
  };

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">Pendências e Alertas</h1>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pendências</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((a) => {
              const url = buildUrl(a);
              return (
                <div
                  key={`${a.dimensionId}-${a.code}`}
                  className="flex items-center justify-between rounded-md border p-3 hover:cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(url)}
                >
                  <div>
                    <div className="font-medium">{a.dimensionLabel}</div>
                    <div className="text-sm text-muted-foreground">{a.text}</div>
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(url);
                      }}
                      className="cursor-pointer"
                    >
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
