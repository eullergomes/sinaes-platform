import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: 'Slug do curso é obrigatório.' },
      { status: 400 }
    );
  }

  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      select: { id: true, slug: true, name: true }
    });
    if (!course)
      return NextResponse.json(
        { error: 'Curso não encontrado.' },
        { status: 404 }
      );
    return NextResponse.json(course);
  } catch (err) {
    console.error('Erro ao buscar curso por slug:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
