'use client';

import { useMemo, useState } from 'react';
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import StatusBadge from '@/components/status-badge';
import { IndicatorGrade } from '@/types/dimension-types';
import { IndicatorStatus } from '@prisma/client';

export type IndicatorRow = {
  code: string;
  name: string;
  grade: IndicatorGrade;
  status: IndicatorStatus;
  lastUpdate: string;
  hasEvaluation: boolean;
  nsaLocked: boolean;
};

function GradeBadge({ grade }: { grade: IndicatorGrade }) {
  switch (grade) {
    case IndicatorGrade.G5:
    case IndicatorGrade.G4:
      return (
        <Badge className="bg-green-600 hover:bg-green-700">
          {grade.slice(1)}
        </Badge>
      );
    case IndicatorGrade.G3:
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          {grade.slice(1)}
        </Badge>
      );
    case IndicatorGrade.G2:
    case IndicatorGrade.G1:
      return <Badge variant="destructive">{grade.slice(1)}</Badge>;
    default:
      return <Badge variant="secondary">NSA</Badge>;
  }
}

export default function IndicatorsTable({
  data,
  visibility,
  onToggleVisibility,
  onEdit
}: {
  data: IndicatorRow[];
  visibility: Record<string, boolean>;
  onToggleVisibility: (code: string, visible: boolean) => void;
  onEdit: (code: string) => void;
}) {
  const columns = useMemo<ColumnDef<IndicatorRow>[]>(
    () => [
      {
        accessorKey: 'code',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Código" />
        ),
        cell: ({ row }) => <div className="w-[80px]">{row.original.code}</div>,
        enableSorting: true
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Indicador" />
        ),
        cell: ({ row }) => (
          <div className="max-w-[520px] truncate" title={row.original.name}>
            {row.original.name}
          </div>
        ),
        enableSorting: true
      },
      {
        accessorKey: 'grade',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Nota" />
        ),
        cell: ({ row }) => {
          const isVisible = visibility[row.original.code] ?? true;
          return (
            <div className="text-center">
              {isVisible ? <GradeBadge grade={row.original.grade} /> : '—'}
            </div>
          );
        },
        enableSorting: true
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const isVisible = visibility[row.original.code] ?? true;
          return (
            <div className="text-center">
              {isVisible ? <StatusBadge status={row.original.status} /> : '—'}
            </div>
          );
        },
        enableSorting: true
      },
      {
        accessorKey: 'lastUpdate',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Última Atualização" />
        ),
        cell: ({ row }) => {
          const isVisible = visibility[row.original.code] ?? true;
          return (
            <div className="text-center">
              {isVisible ? row.original.lastUpdate : '—'}
            </div>
          );
        },
        enableSorting: true
      },
      {
        id: 'actions',
        header: () => <div className="text-center">Ações</div>,
        cell: ({ row }) => {
          const isVisible = visibility[row.original.code] ?? true;
          const { code, hasEvaluation } = row.original;
          return (
            <div className="text-center">
              {hasEvaluation ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(code)}
                  disabled={!isVisible}
                  className="hover:cursor-pointer"
                >
                  Editar
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => onEdit(code)}
                  disabled={!isVisible}
                  className="hover:cursor-pointer"
                >
                  Registrar
                </Button>
              )}
            </div>
          );
        }
      },
      {
        id: 'nsa',
        header: () => <div className="text-center">NSA</div>,
        cell: ({ row }) => {
          const isVisible = visibility[row.original.code] ?? true;
          return (
            <div className="flex items-center justify-center">
              {!row.original.nsaLocked && (
                <Checkbox
                  checked={isVisible}
                  disabled={row.original.nsaLocked}
                  className="hover:cursor-pointer aria-[checked=true]:border-blue-600 aria-[checked=true]:bg-blue-600 aria-[checked=true]:text-white"
                  onCheckedChange={(val) =>
                    onToggleVisibility(row.original.code, Boolean(val))
                  }
                />
              )}
            </div>
          );
        }
      }
    ],
    [onEdit, onToggleVisibility, visibility]
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="space-y-3">
      <div className="rounded-md border">
        <Table>
          <TableHeader className='bg-green-600'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum indicador encontrado com os filtros atuais.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} pageSizeOptions={[10, 20, 50]} />
    </div>
  );
}
