import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { requireCourseIndicatorAccessById } from '@/lib/server-auth';

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { courseId, requirementId, linkId } = body as {
      courseId?: string;
      requirementId?: string;
      linkId?: string;
    };

    if (!courseId || !requirementId || !linkId) {
      return NextResponse.json(
        { error: 'Parâmetros ausentes: courseId, requirementId, linkId' },
        { status: 400 }
      );
    }

    const authResult = await requireCourseIndicatorAccessById(courseId);
    if (!authResult.ok) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Ensure submission exists and matches course+requirement
    const submission = await prisma.evidenceSubmission.findUnique({
      where: { courseId_requirementId: { courseId, requirementId } },
      select: { id: true }
    });
    if (!submission) {
      return NextResponse.json(
        { error: 'Submissão não encontrada' },
        { status: 404 }
      );
    }

    // Ensure link belongs to this submission
    const link = await prisma.evidenceLink.findFirst({
      where: { id: linkId, submissionId: submission.id },
      select: { id: true }
    });
    if (!link) {
      return NextResponse.json(
        { error: 'Link não encontrado' },
        { status: 404 }
      );
    }

    await prisma.evidenceLink.delete({ where: { id: linkId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Falha ao deletar link:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
