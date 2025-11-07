'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/utils/prisma';
import { IndicatorGrade, IndicatorStatus, StorageKind } from '@prisma/client';
import { z } from 'zod';

type EvidenceFileInfo = {
  storageKey: string;
  externalUrl: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
};

type ParsedRawData = {
  courseId?: string;
  courseSlug?: string;
  indicatorDefId?: string;
  evaluationYear?: number | string;
  grade?: IndicatorGrade | string;
  justification?: string;
  correctiveAction?: string;
  responsible?: string;
  evidences: Record<
    string,
    {
      links?: string[];
      linksRich?: { text: string; url: string }[];
      files?: EvidenceFileInfo[];
    }
  >;
};

const EvaluationFormSchema = z.object({
  courseId: z.string(),
  indicatorDefId: z.string(),
  evaluationYear: z.coerce.number().int().min(2000),
  grade: z.nativeEnum(IndicatorGrade),
  justification: z.string().optional(),
  correctiveAction: z.string().optional(),
  responsible: z.string().optional(),
  evidences: z.record(
    z.string(),
    z.object({
      links: z.array(z.string().url().or(z.literal(''))).optional(), // Array de links (permite vazios que serão filtrados)
      linksRich: z
        .array(
          z.object({
            text: z.string().min(1),
            url: z.string().url()
          })
        )
        .optional(),
      files: z
        .array(
          z.object({
            storageKey: z.string(),
            externalUrl: z.string().url(),
            fileName: z.string(),
            sizeBytes: z.number().int(),
            mimeType: z.string()
          })
        )
        .optional()
    })
  )
});

// usar em alguma variável ou exportar se necessário
// type EvaluationInput = z.infer<typeof EvaluationFormSchema>;

export type SaveIndicatorState = {
  errors?: {
    _form?: string[];
    [key: string]: string[] | undefined;
  };
  success: boolean;
};

export async function saveIndicatorEvaluation(
  prevState: SaveIndicatorState,
  formData: FormData
): Promise<SaveIndicatorState> {

  const rawData: ParsedRawData = { evidences: {} };
  const evidenceFiles: Record<string, EvidenceFileInfo[]> = {};
  const evidenceLinks: Record<string, string[]> = {};
  const evidenceLinkItems: Record<string, { text: string; url: string }[]> = {};

  for (const [key, value] of formData.entries()) {
    const linkMatch = key.match(/^evidence-(.+?)-link(?:\[\d+\])?$/);
    const fileInfoMatch = key.match(/^evidence-(.+?)-fileInfo(?:\[\d+\])?$/);
    const linkItemsMatch = key.match(/^evidence-(.+?)-linkItems$/);

    if (linkMatch) {
      const slug = linkMatch[1];
      if (!evidenceLinks[slug]) evidenceLinks[slug] = [];
      if (typeof value === 'string' && value) {
        evidenceLinks[slug].push(value);
      }
      continue;
    }

    if (linkItemsMatch) {
      const slug = linkItemsMatch[1];
      try {
        const parsed = JSON.parse(value as string);
        if (Array.isArray(parsed)) {
          if (!evidenceLinkItems[slug]) evidenceLinkItems[slug] = [];
          evidenceLinkItems[slug].push(
            ...parsed.filter((it) => it && it.url && it.text)
          );
        }
      } catch (e) {
        console.error('Erro ao parsear linkItems JSON:', e);
      }
      continue;
    }

    if (fileInfoMatch) {
      const slug = fileInfoMatch[1];
      try {
        const parsed = JSON.parse(value as string);
        if (Array.isArray(parsed)) {
          if (parsed.length > 0) {
            if (!evidenceFiles[slug]) evidenceFiles[slug] = [];
            evidenceFiles[slug].push(...parsed);
          }
        } else if (parsed) {
          if (!evidenceFiles[slug]) evidenceFiles[slug] = [];
          evidenceFiles[slug].push(parsed as EvidenceFileInfo);
        }
      } catch {
        console.error('Erro ao parsear fileInfo:', value);
      }
      continue;
    }

    if (key === 'grade') {
      rawData.grade = value as IndicatorGrade;
    } else {
      switch (key) {
        case 'courseId':
          rawData.courseId = value as string;
          break;
        case 'courseSlug':
          rawData.courseSlug = value as string;
          break;
        case 'indicatorDefId':
          rawData.indicatorDefId = value as string;
          break;
        case 'evaluationYear':
          rawData.evaluationYear = value as string;
          break;
        case 'justification':
          rawData.justification = value as string;
          break;
        case 'correctiveAction':
          rawData.correctiveAction = value as string;
          break;
        case 'responsible':
          rawData.responsible = value as string;
          break;
        default:
          // Ignora campos desconhecidos
          break;
      }
    }
  }

  Object.keys(evidenceLinks).forEach((slug) => {
    if (!rawData.evidences[slug]) rawData.evidences[slug] = {};
    rawData.evidences[slug].links = evidenceLinks[slug];
  });
  Object.keys(evidenceLinkItems).forEach((slug) => {
    if (!rawData.evidences[slug]) rawData.evidences[slug] = {};
    rawData.evidences[slug].linksRich = evidenceLinkItems[slug];
  });
  Object.keys(evidenceFiles).forEach((slug) => {
    if (!rawData.evidences[slug]) rawData.evidences[slug] = {};
    rawData.evidences[slug].files = evidenceFiles[slug];
  });

  const validatedFields = EvaluationFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.error(
      'Zod Validation Errors:',
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false
    };
  }

  const {
    courseId,
    indicatorDefId,
    evaluationYear,
    grade,
    justification,
    correctiveAction,
    responsible,
    evidences
  } = validatedFields.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.courseIndicator.upsert({
        where: {
          courseId_indicatorDefId_evaluationYear: {
            courseId,
            indicatorDefId,
            evaluationYear
          }
        },
        update: {
          grade,
          status: IndicatorStatus.EM_EDICAO,
          justification:
            grade === IndicatorGrade.G5 || grade === IndicatorGrade.NSA
              ? null
              : justification, // Limpa plano se nota for 5 ou NSA
          correctiveAction:
            grade === IndicatorGrade.G5 || grade === IndicatorGrade.NSA
              ? null
              : correctiveAction,
          responsible:
            grade === IndicatorGrade.G5 || grade === IndicatorGrade.NSA
              ? null
              : responsible,
          lastUpdate: new Date()
        },
        create: {
          courseId,
          indicatorDefId,
          evaluationYear,
          grade,
          status: IndicatorStatus.EM_EDICAO,
          justification,
          correctiveAction,
          responsible
          // nsaApplicable/nsaLocked devem ser definidos ao criar o ciclo
        }
      });

      for (const [evidenceSlug, data] of Object.entries(evidences)) {
        const requirement = await tx.evidenceRequirement.findUnique({
          where: { slug: evidenceSlug }
        });
        if (!requirement) {
          console.warn(
            `Evidence requirement com slug ${evidenceSlug} não encontrado.`
          );
          continue;
        }

        const submission = await tx.evidenceSubmission.upsert({
          where: {
            courseId_requirementId: { courseId, requirementId: requirement.id }
          },
          update: {
            folderUrls: data.links
              ? data.links
              : data.linksRich
                ? data.linksRich.map((l) => l.url)
                : undefined
          },
          create: {
            courseId,
            requirementId: requirement.id,
            folderUrls: data.links
              ? data.links
              : data.linksRich
                ? data.linksRich.map((l) => l.url)
                : []
          }
        });

        if (data.linksRich && Array.isArray(data.linksRich)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const evidenceLink = (tx as any).evidenceLink;
          await evidenceLink.deleteMany({
            where: { submissionId: submission.id }
          });
          if (data.linksRich.length > 0) {
            await evidenceLink.createMany({
              data: data.linksRich.map((it, idx) => ({
                submissionId: submission.id,
                text: it.text,
                url: it.url,
                order: idx
              }))
            });
          }
        } else if (data.links && Array.isArray(data.links)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const evidenceLink = (tx as any).evidenceLink;
          await evidenceLink.deleteMany({
            where: { submissionId: submission.id }
          });
          if (data.links.length > 0) {
            await evidenceLink.createMany({
              data: data.links.map((u, idx) => ({
                submissionId: submission.id,
                text: u,
                url: u,
                order: idx
              }))
            });
          }
        }

        if (data.files && data.files.length > 0) {
          await tx.evidenceFile.createMany({
            data: data.files.map((file) => ({
              submissionId: submission.id,
              kind: StorageKind.EXTERNAL,
              storageKey: file.storageKey,
              externalUrl: file.externalUrl,
              fileName: file.fileName,
              mimeType: file.mimeType,
              sizeBytes: file.sizeBytes
            }))
          });
        }
      }
    });

    const courseSlug = rawData.courseSlug;
    if (courseSlug) {
      revalidatePath(`/courses/${courseSlug}/dimensions`);
    } else {
      revalidatePath(`/courses/${courseId}/dimensions`);
    }
    return { success: true };
  } catch (error) {
    console.error('Falha ao salvar avaliação do indicador:', error);
    return {
      errors: { _form: ['Erro inesperado ao salvar no banco de dados.'] },
      success: false
    };
  }
}
