'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import StatusBadge from '@/components/status-badge';
import { IndicatorGrade, IndicatorStatus } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useUpdateIndicatorStatus } from '@/hooks/useUpdateIndicatorStatus';

export type IndicatorRow = {
  code: string;
  name: string;
  grade: IndicatorGrade;
  status: IndicatorStatus;
  lastUpdate: string;
  hasEvaluation: boolean;
  nsaLocked: boolean;
  nsaApplicable: boolean; // indica se o indicador é aplicável (true) ou está como NSA (false)
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
        <Badge className="bg-yellow-400 hover:bg-yellow-500">
          {grade.slice(1)}
        </Badge>
      );
    case IndicatorGrade.G2:
    case IndicatorGrade.G1:
      return <Badge className="bg-red-600">{grade.slice(1)}</Badge>;
    default:
      return <Badge variant="secondary">NSA</Badge>;
  }
}

const IndicatorsTable = ({
  data,
  nsaStatus,
  onToggleNsa,
  onEdit,
  courseSlug,
  dimensionId,
  year,
  onDiffChange,
  isVisitor = false,
  showNsaControls = false
}: {
  data: IndicatorRow[];
  nsaStatus: Record<string, boolean>;
  onToggleNsa: (code: string, applicable: boolean) => void;
  onEdit: (code: string) => void;
  courseSlug: string;
  dimensionId: string;
  year: number;
  onDiffChange?: (
    diff: { indicatorCode: string; nsaApplicable: boolean }[]
  ) => void;
  isVisitor?: boolean;
  showNsaControls?: boolean;
}) => {
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, IndicatorStatus>
  >({});

  const { updateStatus, updating, error } = useUpdateIndicatorStatus({
    courseSlug,
    dimensionId,
    year
  });
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const nsaDiff = useMemo(() => {
    return data
      .filter((row) => !row.nsaLocked)
      .filter((row) => {
        const currentApplicable = nsaStatus[row.code] ?? true;
        return currentApplicable !== row.nsaApplicable;
      })
      .map((row) => ({
        indicatorCode: row.code,
        nsaApplicable: nsaStatus[row.code] ?? true
      }));
  }, [data, nsaStatus]);

  useEffect(() => {
    onDiffChange?.(nsaDiff);
  }, [nsaDiff, onDiffChange]);
  const columns = useMemo<ColumnDef<IndicatorRow>[]>(() => {
    const base: ColumnDef<IndicatorRow>[] = [];
    base.push({
      accessorKey: 'code',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Código" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.original.code}</div>,
      enableSorting: false
    });
    base.push({
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Indicador" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[520px] truncate" title={row.original.name}>
          {row.original.name}
        </div>
      ),
      enableSorting: false
    });
    if (showNsaControls) {
      base.unshift({
        id: 'nsa',
        header: () => <div className="text-center font-medium">NSA</div>,
        cell: ({ row }) => {
          const isApplicable = nsaStatus[row.original.code] ?? true;
          return (
            <div className="flex items-center justify-center">
              {!row.original.nsaLocked && (
                <Checkbox
                  checked={isApplicable}
                  disabled={row.original.nsaLocked}
                  onCheckedChange={(val) =>
                    onToggleNsa(row.original.code, Boolean(val))
                  }
                  aria-label={`Alternar NSA para ${row.original.code}`}
                />
              )}
            </div>
          );
        }
      });
      base.push({
        accessorKey: 'grade',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Nota" />
        ),
        cell: ({ row }) => {
          const isVisible = nsaStatus[row.original.code] ?? true;
          return (
            <div className="text-center">
              {isVisible ? <GradeBadge grade={row.original.grade} /> : '—'}
            </div>
          );
        },
        enableSorting: false
      });
      base.push({
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const isVisible = nsaStatus[row.original.code] ?? true;
          const code = row.original.code;
          const effectiveStatus = statusOverrides[code] ?? row.original.status;
          const disabled = !isVisible || !row.original.hasEvaluation;
          return (
            <div className="flex items-center justify-center">
              {isVisible ? (
                <Select
                  value={effectiveStatus}
                  onValueChange={(val) => {
                    const next = val as IndicatorStatus;
                    if (next === effectiveStatus) return;
                    const confirmed =
                      typeof window === 'undefined'
                        ? true
                        : window.confirm(
                            `Confirmar alteração do status do indicador ${code} para "${next}"?`
                          );
                    if (!confirmed) return;
                    setStatusOverrides((prev) => ({ ...prev, [code]: next }));
                    updateStatus(code, next).catch((err) => {
                      setStatusOverrides((prev) => {
                        const copy = { ...prev };
                        copy[code] = row.original.status;
                        return copy;
                      });
                      toast.error(
                        err instanceof Error
                          ? err.message
                          : 'Erro ao atualizar status'
                      );
                    });
                  }}
                  disabled={disabled || !!updating[code]}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue>
                      <div className="flex items-center justify-center">
                        <StatusBadge status={effectiveStatus} />
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="min-w-[140px]">
                    {Object.values(IndicatorStatus).map((s) => (
                      <SelectItem key={s} value={s} className="cursor-pointer">
                        <div className="flex items-center">
                          <StatusBadge status={s} />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                '—'
              )}
            </div>
          );
        },
        enableSorting: false
      });
      base.push({
        accessorKey: 'lastUpdate',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Última Atualização" />
        ),
        cell: ({ row }) => {
          const isVisible = nsaStatus[row.original.code] ?? true;
          return (
            <div className="text-center">
              {isVisible ? row.original.lastUpdate : '—'}
            </div>
          );
        },
        enableSorting: false
      });
    }
    base.push({
      id: 'actions',
      header: () => <div className="text-center">Ações</div>,
      cell: ({ row }) => {
        const isVisible = nsaStatus[row.original.code] ?? true;
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
                {isVisitor ? 'Ver' : 'Editar'}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => onEdit(code)}
                disabled={!isVisible}
                className="hover:cursor-pointer"
              >
                {isVisitor ? 'Ver' : 'Registrar'}
              </Button>
            )}
          </div>
        );
      }
    });
    return base;
  }, [
    nsaStatus,
    onToggleNsa,
    onEdit,
    statusOverrides,
    isVisitor,
    showNsaControls,
    updateStatus,
    updating
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="space-y-3">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-green-600">
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
              table.getRowModel().rows.map((row) => {
                const isApplicable =
                  nsaStatus[(row.original as IndicatorRow).code] ?? true;
                return (
                  <TableRow
                    key={row.id}
                    className={`hover:bg-muted ${
                      isApplicable
                        ? undefined
                        : 'bg-muted/50 text-muted-foreground'
                    }`}
                    aria-disabled={isApplicable ? undefined : true}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
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
    </div>
  );
};

export default IndicatorsTable;
