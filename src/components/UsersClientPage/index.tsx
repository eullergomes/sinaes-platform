'use client';

import { useEffect, useState, useTransition, useCallback } from 'react';
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
import { UserRole } from '@prisma/client';
import { Search } from 'lucide-react';

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
};

const UsersClientPage = ({
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
}) => {
  const [list, setList] = useState(users);
  const [searchInput, setSearchInput] = useState(q);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateQuery = useCallback(
    (params: Record<string, string | number | undefined>) => {
      const sp = new URLSearchParams(searchParams?.toString());
      Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === '') sp.delete(k);
        else sp.set(k, String(v));
      });
      const url = `/admin/users?${sp.toString()}`;
      router.replace(url);
      router.refresh();
    },
    [searchParams, router]
  );

  // Sync local input if external q changes (e.g., navigation)
  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  // Sync table data when server-provided users prop changes
  useEffect(() => {
    setList(users);
  }, [users]);

  // Debounce search updates on input change
  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchInput !== q) {
        updateQuery({ q: searchInput, page: 1 });
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [searchInput, q, updateQuery]);

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
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
            <Input
            id="user-search"
            value={searchInput}
            placeholder="Nome ou e-mail"
            onChange={(e) => setSearchInput(e.target.value)}
            className='pl-8'
          />
          </div>
        </div>
        <div className="w-48">
          <label className="text-sm font-semibold">Papel</label>
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
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="DIRECTOR">Direção</SelectItem>
              <SelectItem value="COORDINATOR">Coordenador</SelectItem>
              <SelectItem value="VISITOR">Visitante</SelectItem>
            </SelectContent>
          </Select>
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

export default UsersClientPage;