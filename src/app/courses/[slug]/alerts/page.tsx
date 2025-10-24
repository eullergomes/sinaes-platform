'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';

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
    code: '1.6'
  },
  {
    dimensionId: '1',
    dimensionLabel: 'Dimensão 1',
    text: 'Preencher indicador 1.10 - Atividades complementares',
    code: '1.10'
  },
  {
    dimensionId: '1',
    dimensionLabel: 'Dimensão 1',
    text: 'Preencher indicador 1.18 - Material didático',
    code: '1.18'
  },
  {
    dimensionId: '2',
    dimensionLabel: 'Dimensão 2',
    text: 'Atualizar evidências do indicador 2.3 - Coordenador',
    code: '2.3'
  },
  {
    dimensionId: '2',
    dimensionLabel: 'Dimensão 2',
    text: 'Atualizar evidências do indicador 2.8 - Experiência no exercício da docência na educação básica',
    code: '2.8'
  },
  {
    dimensionId: '3',
    dimensionLabel: 'Dimensão 3',
    text: 'Falta documento comprobatório do indicador 3.18',
    code: '3.18'
  }
];

function extractCourseId(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  const i = parts.indexOf('courses');
  if (i >= 0 && parts[i + 1]) return decodeURIComponent(parts[i + 1]);
  return null;
}

const AlertsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const courseId = extractCourseId(pathname);
  const [openDims, setOpenDims] = useState<Set<string>>(new Set());

  const buildUrl = (a: AlertItem) => {
    if (!courseId) return '/courses';
    return `/courses/${courseId}/dimensions/${a.dimensionId}/indicators/${a.code}`;
  };

  // Agrupa alertas por dimensão
  const grouped = alerts.reduce(
    (acc, a) => {
      if (!acc[a.dimensionId])
        acc[a.dimensionId] = {
          label: a.dimensionLabel,
          items: [] as AlertItem[]
        };
      acc[a.dimensionId].items.push(a);
      return acc;
    },
    {} as Record<string, { label: string; items: AlertItem[] }>
  );

  const toggleDim = (dimId: string, open: boolean) => {
    setOpenDims((prev) => {
      const next = new Set(prev);
      if (open) next.add(dimId);
      else next.delete(dimId);
      return next;
    });
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
            {Object.entries(grouped).map(([dimId, group]) => {
              const isOpen = openDims.has(dimId);
              return (
                <Collapsible
                  key={dimId}
                  open={isOpen}
                  onOpenChange={(o) => toggleDim(dimId, o)}
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between rounded-md border p-3 hover:cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{group.label}</span>
                        <Badge
                          variant="destructive"
                          className="h-5 min-w-5 rounded-full bg-red-500 px-1 font-mono tabular-nums"
                        >
                          {group.items.length}
                        </Badge>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 space-y-2 pl-4">
                      {group.items.map((a) => {
                        const url = buildUrl(a);
                        return (
                          <div
                            key={`${a.dimensionId}-${a.code}`}
                            className="flex items-center justify-between rounded-md border p-3 hover:cursor-pointer hover:bg-gray-50"
                            onClick={() => router.push(url)}
                          >
                            <div>
                              <div className="text-muted-foreground text-sm">
                                {a.text}
                              </div>
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
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsPage;
