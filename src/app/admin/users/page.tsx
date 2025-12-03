import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import prisma from '@/utils/prisma';
import UsersClientPage from '@/components/UsersClientPage';
import { UserRole } from '@prisma/client';

type SearchParams = {
  q?: string;
  role?: string;
  page?: string;
  pageSize?: string;
};

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Await dynamic search params per Next.js dynamic API requirements
  const sp = await searchParams;
  // Verifica sessão e papel do usuário
  const cookieHeader = (await headers()).get('cookie') ?? '';
  const session = await auth.api.getSession({
    headers: { cookie: cookieHeader }
  });

  const role = session?.user?.role;
  const isAdmin = role === 'ADMIN' || role === UserRole.ADMIN;
  if (!session?.user || !isAdmin) {
    redirect('/');
  }

  // Query params
  const q = (sp.q ?? '').trim();
  const selectedRole = (sp.role ?? '').trim();
  const page = Math.max(parseInt(sp.page ?? '1', 10) || 1, 1);
  const pageSize = Math.min(
    Math.max(parseInt(sp.pageSize ?? '10', 10) || 10, 1),
    100
  );
  const skip = (page - 1) * pageSize;

  // Filtro
  const where: {
    OR?: Array<{ name?: { contains: string }; email?: { contains: string } }>;
    role?: UserRole;
  } = {};
  if (q) {
    where.OR = [{ name: { contains: q } }, { email: { contains: q } }];
  }
  if (
    selectedRole &&
    ['ADMIN', 'DIRECTOR', 'COORDINATOR', 'VISITOR'].includes(selectedRole)
  ) {
    where.role = selectedRole as UserRole;
  }

  const [totalCount, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    })
  ]);

  return (
    <div className="space-y-8 p-6 md:p-8">
      <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
      <UsersClientPage
        currentUserId={session.user.id}
        users={users.map((u) => ({
          ...u,
          createdAt: u.createdAt.toISOString()
        }))}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        q={q}
        roleFilter={selectedRole || 'ALL'}
      />
    </div>
  );
}
