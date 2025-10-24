'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';

type AlertItem = {
  dimensionId: '1' | '2' | '3';
  text: string;
  code: string;
};

function extractCourseId(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  const i = parts.indexOf('courses');
  if (i >= 0 && parts[i + 1]) return decodeURIComponent(parts[i + 1]);
  return null;
}

const PendingAlerts = () => {
  const router = useRouter();
  const pathname = usePathname();
  const courseId = extractCourseId(pathname);

  const alerts: AlertItem[] = [
    {
      dimensionId: '1',
      text: 'Preencher indicador 1.6 - Metodologia',
      code: '1.6'
    },
    {
      dimensionId: '2',
      text: 'Atualizar evidências do indicador 2.3 - Coordenador',
      code: '2.3'
    },
    {
      dimensionId: '3',
      text: 'Falta documento comprobatório do indicador 3.18',
      code: '3.18'
    }
  ];

  const count = alerts.length;

  const buildIndicatorUrl = (dimensionId: '1' | '2' | '3', code: string) => {
    if (!courseId) return '/courses'; // fallback: seleção de curso
    return `/courses/${courseId}/dimensions/${dimensionId}/indicators/${code}`;
  };

  const ALL_ALERTS_URL = `/courses/${courseId}/alerts`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={`Notificações (${count})`}
          className="relative rounded-md p-2 hover:cursor-pointer hover:bg-gray-100"
        >
          <Bell className="h-5 w-5" />
          <span className="pointer-events-none absolute -top-0 -right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white">
            {count}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="end" className="w-72">
        <DropdownMenuLabel>Pendências e Alertas</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {alerts.map((a) => {
          const url = buildIndicatorUrl(a.dimensionId, a.code);
          return (
            <DropdownMenuItem
              key={`${a.dimensionId}-${a.code}`}
              onSelect={() => router.push(url)}
              className="hover:cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{`Dimensão ${a.dimensionId}`}</span>
                <span className="text-muted-foreground text-xs">{a.text}</span>
              </div>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => router.push(ALL_ALERTS_URL)}
          className="flex justify-center bg-green-600 text-white hover:cursor-pointer hover:bg-green-700"
        >
          Ver todos
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PendingAlerts;
