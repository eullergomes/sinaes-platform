import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      select: { id: true }
    });
    if (!course) return NextResponse.json({ years: [] }, { status: 200 });

    const aggregates = await prisma.courseIndicator.groupBy({
      by: ['evaluationYear'],
      where: { courseId: course.id },
      _count: { _all: true },
      orderBy: { evaluationYear: 'desc' }
    });
    const years = aggregates
      .map((a) => a.evaluationYear)
      .filter((y): y is number => typeof y === 'number');
    const latest = years[0] ?? null;
    return NextResponse.json({ years, latest });
  } catch {
    return NextResponse.json({ years: [] }, { status: 200 });
  }
}
