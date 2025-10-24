import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { UserRole } from '@prisma/client';

export async function GET(request: Request) {  
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    const coordinators = await prisma.user.findMany({
      where: {
        role: UserRole.COORDENADOR,
        ...(query && {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: 10,
    });

    return NextResponse.json(coordinators);
  } catch (error) {
    console.error('Falha ao buscar coordenadores:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
