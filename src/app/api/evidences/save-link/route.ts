import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, requirementId, text, url } = body;
    if (!courseId || !requirementId || !text || !url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure requirement exists
    const requirement = await prisma.evidenceRequirement.findUnique({
      where: { id: requirementId }
    });
    if (!requirement) {
      return NextResponse.json(
        { error: 'Requirement not found' },
        { status: 404 }
      );
    }

    // Transaction: find or create submission, update folderUrls, create link
    const result = await prisma.$transaction(async (tx) => {
      let submission = await tx.evidenceSubmission.findUnique({
        where: { courseId_requirementId: { courseId, requirementId } }
      });

      if (!submission) {
        submission = await tx.evidenceSubmission.create({
          data: {
            courseId,
            requirementId,
            folderUrls: [url]
          }
        });
      } else {
        const existing = Array.isArray(submission.folderUrls)
          ? submission.folderUrls
          : [];
        const next = Array.from(new Set([...existing, url]));
        submission = await tx.evidenceSubmission.update({
          where: { id: submission.id },
          data: { folderUrls: next }
        });
      }

      const count = await tx.evidenceLink.count({
        where: { submissionId: submission.id }
      });
      const link = await tx.evidenceLink.create({
        data: {
          submissionId: submission.id,
          text,
          url,
          order: count
        }
      });

      return { submissionId: submission.id, linkId: link.id };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Failed to save evidence link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
