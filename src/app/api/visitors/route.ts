import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { UserRole } from '@prisma/client';
import { requireVisitorSearchAccess } from '@/lib/server-auth';

export async function GET(request: Request) {
  const authResult = await requireVisitorSearchAccess();
  if (!authResult.ok) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') ?? '';

  const visitors = await prisma.user.findMany({
    where: {
      role: UserRole.VISITOR,
      ...(query && {
        OR: [
          { name:  { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      }),
    },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
    take: 10,
  });

  return NextResponse.json(visitors);
}
