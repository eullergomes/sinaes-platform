'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import UsersTable from './UsersTable';
import { toast } from 'sonner';
import { updateUserRole } from '@/actions/user';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DIRECTOR' | 'COORDINATOR' | 'VISITOR' | string;
  createdAt?: string;
};

export default function UsersClientPage({
  users,
  currentUserId,
  totalCount,
  page,
  pageSize,
  q,
  roleFilter
}: {
  users: UserItem[];
  currentUserId: string;
  totalCount: number;
  page: number;
  pageSize: number;
  q: string;
  roleFilter: string;
}) {
  const [list, setList] = useState(users);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateQuery(params: Record<string, string | number | undefined>) {
    const sp = new URLSearchParams(searchParams?.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === '') sp.delete(k);
      else sp.set(k, String(v));
    });
    const url = `/admin/users?${sp.toString()}`;
    router.replace(url);
    router.refresh();
  }

  const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1);

  async function handleChangeRole(id: string, toRole: 'DIRECTOR' | 'VISITOR') {
    startTransition(async () => {
      const prev = [...list];
      setList((l) => l.map((u) => (u.id === id ? { ...u, role: toRole } : u)));
      const res = await updateUserRole(id, toRole);
      if (!res.success) {
        setList(prev);
        toast.error(res.error || 'Falha ao atualizar papel do usuário');
      } else {
        toast.success(
          toRole === 'DIRECTOR'
            ? 'Usuário promovido a Diretor'
            : 'Usuário alterado para Visitante'
        );
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium" htmlFor="user-search">
            Buscar
          </label>
          <Input
            id="user-search"
            defaultValue={q}
            placeholder="Nome ou e-mail"
            onKeyDown={(e) => {
              if (e.key === 'Enter')
                updateQuery({
                  q: (e.target as HTMLInputElement).value,
                  page: 1
                });
            }}
          />
        </div>
        <div className="w-48">
          <label className="text-sm font-medium">Papel</label>
          <Select
            value={roleFilter}
            onValueChange={(v) =>
              updateQuery({ role: v === 'ALL' ? undefined : v, page: 1 })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
              <SelectItem value="DIRECTOR">DIRECTOR</SelectItem>
              <SelectItem value="COORDINATOR">COORDINATOR</SelectItem>
              <SelectItem value="VISITOR">VISITOR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button
            onClick={() =>
              updateQuery({
                q,
                role: roleFilter === 'ALL' ? undefined : roleFilter,
                page: 1
              })
            }
            variant="outline"
          >
            Aplicar
          </Button>
        </div>
      </div>
      <UsersTable
        data={list}
        currentUserId={currentUserId}
        isPending={isPending}
        onChangeRole={handleChangeRole}
      />
      <div className="flex flex-col gap-3 pt-3 text-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap">Linhas por página</span>
          <div className="w-24">
            <Select
              value={String(pageSize)}
              onValueChange={(v) => updateQuery({ pageSize: v, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span>
            Página {page} de {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => updateQuery({ page: 1 })}
            >
              {'<<'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => updateQuery({ page: page - 1 })}
            >
              {'<'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => updateQuery({ page: page + 1 })}
            >
              {'>'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => updateQuery({ page: totalPages })}
            >
              {'>>'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
