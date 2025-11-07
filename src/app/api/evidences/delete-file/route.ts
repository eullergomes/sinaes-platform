import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function DELETE(req: Request) {
  try {
    const { courseId, requirementId, publicId } = await req.json();

    if (!publicId || (!courseId && !requirementId)) {
      return NextResponse.json(
        {
          error:
            'Parâmetros inválidos. Informe publicId e (courseId + requirementId).'
        },
        { status: 400 }
      );
    }

    const submission = await prisma.evidenceSubmission.findUnique({
      where: { courseId_requirementId: { courseId, requirementId } },
      select: { id: true }
    });

    if (!submission) {
      return NextResponse.json(
        {
          error:
            'Submissão de evidência não encontrada para os parâmetros informados.'
        },
        { status: 404 }
      );
    }

    const result = await prisma.evidenceFile.deleteMany({
      where: { submissionId: submission.id, storageKey: publicId }
    });

    // OBS: a remoção no Cloudinary não foi feita aqui.
    // Levantar requisito: Pode ser adicionada via Admin API, se for solicitado.

    return NextResponse.json({ success: true, deletedCount: result.count });
  } catch (error) {
    console.error('Erro ao deletar arquivo de evidência:', error);
    return NextResponse.json(
      { error: 'Erro interno ao deletar arquivo.' },
      { status: 500 }
    );
  }
}
