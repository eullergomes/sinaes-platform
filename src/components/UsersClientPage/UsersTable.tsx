'use client';

import * as React from 'react';
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
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
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DIRECTOR' | 'COORDINATOR' | 'VISITOR' | string;
  createdAt?: string;
};

type UsersTableProps = {
  data: UserRow[];
  currentUserId: string;
  isPending: boolean;
  onChangeRole: (id: string, toRole: 'DIRECTOR' | 'VISITOR') => void;
};

export default function UsersTable({
  data,
  currentUserId,
  isPending,
  onChangeRole
}: UsersTableProps) {
  const columns = React.useMemo<ColumnDef<UserRow>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Nome" />
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
        enableSorting: true
      },
      {
        accessorKey: 'email',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => row.original.email,
        enableSorting: true
      },
      {
        accessorKey: 'role',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Papel" />
        ),
        cell: ({ row }) => row.original.role,
        enableSorting: true
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Ações</div>,
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="space-x-2 text-right">
              {u.role === 'VISITOR' && (
                <Button
                  size="sm"
                  disabled={isPending || u.id === currentUserId}
                  onClick={() => onChangeRole(u.id, 'DIRECTOR')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Tornar Diretor
                </Button>
              )}
              {u.role === 'DIRECTOR' && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending || u.id === currentUserId}
                  onClick={() => onChangeRole(u.id, 'VISITOR')}
                >
                  Tornar Visitante
                </Button>
              )}
            </div>
          );
        }
      }
    ],
    [currentUserId, isPending, onChangeRole]
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
