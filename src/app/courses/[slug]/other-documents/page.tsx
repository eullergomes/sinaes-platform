import prisma from '@/utils/prisma';
import { revalidatePath } from 'next/cache';
import OtherDocumentsForm from '@/components/OtherDocumentsForm';

type Params = Promise<{ slug: string }>

export default async function OtherDocumentsPage({ params }: { params: Params }) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({ where: { slug } });

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

    await prisma.course.update({
      where: { slug: formSlug },
      data: { otherDocumentsUrl }
    });

    revalidatePath(`/courses/${formSlug}/other-documents`);
  }
  
  return (
    <div className="max-w-xl p-8 space-y-6">
      <h1 className="text-3xl font-bold">Outros Documentos</h1>
      <OtherDocumentsForm
        initialUrl={course?.otherDocumentsUrl ?? ''}
        slug={slug}
        onSave={saveOtherDocuments}
      />
    </div>
  );
}