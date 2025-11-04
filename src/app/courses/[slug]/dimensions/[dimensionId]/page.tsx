import ClientDimensionPage from '@/components/ClientDimensionPage';
import prisma from '@/utils/prisma';
import { redirect } from 'next/navigation';

type Params = { slug: string; dimensionId: string };
type SearchParams = { year?: string };

export default async function DimensionPage({
  params,
  searchParams
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await params;
  const { slug, dimensionId: dimId } = resolved;
  const { year } = await searchParams;

  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) {
    return <div>Curso não encontrado.</div>;
  }

  const latestEvaluation = await prisma.courseIndicator.aggregate({
    _max: { evaluationYear: true },
    where: { courseId: course.id }
  });
  const latestYear = latestEvaluation._max.evaluationYear;
  if (!latestYear) {
    redirect(`/courses/${slug}/dimensions`);
  }

  return <ClientDimensionPage slug={slug} dimId={dimId} year={year} />;
}
