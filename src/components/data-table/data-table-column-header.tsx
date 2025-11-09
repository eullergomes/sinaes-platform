import { type Column } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import ArrowDown from '@/icons/ArrowDown';
import ArrowUp from '@/icons/ArrowUpIcon';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const isSorted = column.getIsSorted();
  const nextSort: 'asc' | 'desc' | 'none' = !isSorted
    ? 'asc'
    : isSorted === 'asc'
      ? 'desc'
      : 'none';

  function handleClick() {
    const state = column.getIsSorted();
    if (!state) {
      // go to asc
      column.toggleSorting(false);
    } else if (state === 'asc') {
      // go to desc
      column.toggleSorting(true);
    } else {
      // clear sorting
      const c = column as unknown as {
        clearSorting?: () => void;
        getTable?: () => { setSorting: (updater: unknown) => void };
      };
      if (c.clearSorting) c.clearSorting();
      else c.getTable?.().setSorting([]);
    }
  }

  const tooltipText =
    nextSort === 'asc'
      ? 'Ordenar por ascendente'
      : nextSort === 'desc'
        ? 'Ordenar por descendente'
        : 'Remover ordenação';

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={tooltipText}
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 text-white hover:bg-green-700 hover:text-white"
            onClick={handleClick}
          >
            <span className="p-2 text-left">{title}</span>
            {isSorted === 'desc' ? (
              <ArrowUp className="ml-2 h-4 w-4" aria-hidden="true" />
            ) : isSorted === 'asc' ? (
              <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    </div>
  );
}
