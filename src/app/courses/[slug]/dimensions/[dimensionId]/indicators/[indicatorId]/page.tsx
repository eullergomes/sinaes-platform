import ClientIndicatorPage from '@/components/ClientIndicatorPage';
import prisma from '@/utils/prisma';

type Params = { slug: string; dimensionId: string; indicatorId: string };

export default async function IndicadorPage({
  params
}: {
  params: Promise<Params>;
}) {
  const { slug, dimensionId, indicatorId } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    select: { id: true, slug: true }
  });
  if (!course) {
    return <div>Curso não encontrado.</div>;
  }
  const indicatorDef = await prisma.indicatorDefinition.findUnique({
    where: { code: indicatorId },
    include: {
      requirements: {
        include: { requirement: true },
        orderBy: { order: 'asc' }
      }
    }
  });
  if (!indicatorDef) {
    return <div>Indicador não encontrado.</div>;
  }

  const evaluation = await prisma.courseIndicator.findFirst({
    where: { courseId: course.id, indicatorDefId: indicatorDef.id },
    select: {
      grade: true,
      justification: true,
      correctiveAction: true,
      responsible: true,
      nsaApplicable: true,
      nsaLocked: true
    }
  });

  const requirementIds = indicatorDef.requirements.map((r) => r.requirement.id);
  const submissions = await prisma.evidenceSubmission.findMany({
    where: { courseId: course.id, requirementId: { in: requirementIds } },
    include: {
      files: {
        select: {
          fileName: true,
          sizeBytes: true,
          externalUrl: true,
          storageKey: true
        }
      },
      links: {
        select: { id: true, text: true, url: true, order: true },
        orderBy: { order: 'asc' }
      }
    }
  });
  const submissionMap = new Map(submissions.map((s) => [s.requirementId, s]));

  const initialIndicator = {
    course: { id: course.id, slug: course.slug },
    indicator: {
      id: indicatorDef.id,
      code: indicatorDef.code,
      name: indicatorDef.name,
      criteriaTable: indicatorDef.criteriaTable
    },
    evaluation: evaluation,
    requiredEvidences: indicatorDef.requirements.map((req) => {
      const sub = submissionMap.get(req.requirement.id) || null;
      return {
        id: req.requirement.id,
        slug: req.requirement.slug,
        title: req.requirement.title,
        submission: sub
          ? {
              folderUrls: Array.isArray(sub.folderUrls) ? sub.folderUrls : null,
              links: Array.isArray(sub.links)
                ? sub.links.map((l) => ({ text: l.text, url: l.url }))
                : [],
              files: Array.isArray(sub.files)
                ? sub.files.map((f) => ({
                    fileName: f.fileName,
                    sizeBytes: f.sizeBytes,
                    url: f.externalUrl ?? undefined,
                    publicId: f.storageKey ?? undefined
                  }))
                : []
            }
          : null
      };
    })
  };

  return (
    <ClientIndicatorPage
      slug={slug}
      indicadorCode={indicatorId}
      dimensionId={dimensionId}
      initialIndicator={initialIndicator}
    />
  );
}
