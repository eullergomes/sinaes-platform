import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { UserRole } from '@prisma/client';

export async function GET(request: Request) {
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
