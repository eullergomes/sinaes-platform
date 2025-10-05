'use client';

import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';

const PendingAlerts = () => {
  const router = useRouter();

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

  const count = alerts.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={`Notificações (${count})`}
          className="relative rounded-md p-2 mr-8 hover:cursor-pointer hover:bg-gray-100"
        >
          <Bell className="h-5 w-5" />
          {/* Red badge always visible with count */}
          <span className="pointer-events-none absolute -top-0 -right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white ring-2 ring-white">
            {count}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-72">
        <DropdownMenuLabel>Pendências e Alertas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {alerts.map((a) => (
          <DropdownMenuItem
            key={a.url}
            onSelect={() => router.push(a.url)}
            className="hover:cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">{a.dimension}</span>
              <span className="text-muted-foreground text-xs">{a.text}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push('/alerts')} className='hover:cursor-pointer flex justify-center bg-gray-800 text-white'>
          Ver todos
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PendingAlerts;
