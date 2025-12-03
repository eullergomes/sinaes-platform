import prisma from '@/utils/prisma';
import { revalidatePath } from 'next/cache';
import OtherDocumentsForm from '@/components/OtherDocumentsForm';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { canEditOtherDocuments } from '@/lib/permissions';

type Params = Promise<{ slug: string }>;

export default async function OtherDocumentsPage({
  params
}: {
  params: Params;
}) {
  const { slug } = await params;

  const cookieHeader = (await headers()).get('cookie') ?? '';
  const session = await auth.api.getSession({
    headers: { cookie: cookieHeader }
  });

  const course = await prisma.course.findUnique({
    where: { slug },
    select: { slug: true, otherDocumentsUrl: true, coordinatorId: true }
  });

  const role = session?.user?.role as string | undefined;
  const canEdit = canEditOtherDocuments({
    role,
    userId: session?.user?.id ?? null,
    courseCoordinatorId: course?.coordinatorId
  });

  async function saveOtherDocuments(formData: FormData) {
    'use server';
    const formSlug = (formData.get('slug') as string) ?? '';
    const urlRaw = ((formData.get('otherDocumentsUrl') as string) ?? '').trim();

    const otherDocumentsUrl = urlRaw.length === 0 ? null : urlRaw;

    if (otherDocumentsUrl) {
      try {
        new URL(otherDocumentsUrl);
      } catch {
        return;
      }
    }

    // Server-side permission check
    const cookieHeader2 = (await headers()).get('cookie') ?? '';
    const session2 = await auth.api.getSession({
      headers: { cookie: cookieHeader2 }
    });
    const target = await prisma.course.findUnique({
      where: { slug: formSlug },
      select: { coordinatorId: true }
    });
    const role2 = session2?.user?.role as string | undefined;
    const canEdit2 = canEditOtherDocuments({
      role: role2,
      userId: session2?.user?.id ?? null,
      courseCoordinatorId: target?.coordinatorId
    });
    if (!canEdit2) {
      return;
    }

    await prisma.course.update({
      where: { slug: formSlug },
      data: { otherDocumentsUrl }
    });

    revalidatePath(`/courses/${formSlug}/other-documents`);
  }

  return (
    <div className="space-y-8 p-6 md:p-8">
      <h1 className="text-3xl font-bold">Outros Documentos</h1>
      <OtherDocumentsForm
        initialUrl={course?.otherDocumentsUrl ?? ''}
        slug={slug}
        onSave={saveOtherDocuments}
        canEdit={canEdit}
      />
    </div>
  );
}
