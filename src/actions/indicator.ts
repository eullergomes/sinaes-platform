'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/utils/prisma';
import { IndicatorGrade, IndicatorStatus, StorageKind } from '@prisma/client';
import { z } from 'zod';

// Schema Zod para validar os dados recebidos do formulário
const EvaluationFormSchema = z.object({
  courseId: z.string(),
  indicatorDefId: z.string(),
  evaluationYear: z.coerce.number().int().min(2000),
  grade: z.nativeEnum(IndicatorGrade),
  justification: z.string().optional(),
  correctiveAction: z.string().optional(),
  responsible: z.string().optional(),
  // Estrutura para receber os dados das evidências
  evidences: z.record(z.object({ // O record key será o evidenceSlug
      links: z.array(z.string().url().or(z.literal(''))).optional(), // Array de links (permite vazios que serão filtrados)
      files: z.array(z.object({ // Array de arquivos enviados para Cloudinary
          storageKey: z.string(), // public_id do Cloudinary
          externalUrl: z.string().url(), // secure_url do Cloudinary
          fileName: z.string(),
          sizeBytes: z.number().int(),
          mimeType: z.string(), // ex: application/pdf
      })).optional(),
  })),
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

  // Extrair e estruturar os dados do FormData
  const rawData: Record<string, any> = { evidences: {} };
  const evidenceFiles: Record<string, any[]> = {};
  const evidenceLinks: Record<string, string[]> = {};

  for (const [key, value] of formData.entries()) {
    if (key.startsWith('evidence-') && key.endsWith('-link')) {
        // Ex: evidence-ppc-link[0], evidence-ppc-link[1]...
        const slug = key.split('-')[1];
        if (!evidenceLinks[slug]) evidenceLinks[slug] = [];
        if (value) evidenceLinks[slug].push(value as string); // Adiciona apenas links não vazios
    } else if (key.startsWith('evidence-') && key.endsWith('-fileInfo')) {
        // Ex: evidence-ppc-fileInfo[0], evidence-ppc-fileInfo[1]... (JSON stringificado)
        const slug = key.split('-')[1];
         if (!evidenceFiles[slug]) evidenceFiles[slug] = [];
         try {
             evidenceFiles[slug].push(JSON.parse(value as string));
         } catch (e) { console.error("Erro ao parsear fileInfo:", value); }
    } else if (key === 'grade') {
        rawData[key] = value as IndicatorGrade; // Tratar enum
    } else {
        rawData[key] = value;
    }
  }
  
  // Combina links e files na estrutura esperada pelo Zod
  Object.keys(evidenceLinks).forEach(slug => {
    if (!rawData.evidences[slug]) rawData.evidences[slug] = {};
    rawData.evidences[slug].links = evidenceLinks[slug];
  });
   Object.keys(evidenceFiles).forEach(slug => {
    if (!rawData.evidences[slug]) rawData.evidences[slug] = {};
    rawData.evidences[slug].files = evidenceFiles[slug];
  });

  // Validar com Zod
  const validatedFields = EvaluationFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
      console.error("Zod Validation Errors:", validatedFields.error.flatten().fieldErrors);
    return { errors: validatedFields.error.flatten().fieldErrors, success: false };
  }

  const {
    courseId,
    indicatorDefId,
    evaluationYear,
    grade,
    justification,
    correctiveAction,
    responsible,
    evidences,
  } = validatedFields.data;

  try {
    // Usar transação Prisma para garantir atomicidade
    await prisma.$transaction(async (tx) => {
      // 1. Atualiza ou cria o registro CourseIndicator (avaliação principal)
      const evaluation = await tx.courseIndicator.upsert({
        where: {
          courseId_indicatorDefId_evaluationYear: { courseId, indicatorDefId, evaluationYear },
        },
        update: {
          grade,
          status: IndicatorStatus.EM_EDICAO,
          justification: (grade === IndicatorGrade.G5 || grade === IndicatorGrade.NSA) ? null : justification, // Limpa plano se nota for 5 ou NSA
          correctiveAction: (grade === IndicatorGrade.G5 || grade === IndicatorGrade.NSA) ? null : correctiveAction,
          responsible: (grade === IndicatorGrade.G5 || grade === IndicatorGrade.NSA) ? null : responsible,
          lastUpdate: new Date(),
        },
        create: {
          courseId,
          indicatorDefId,
          evaluationYear,
          grade,
          status: IndicatorStatus.EM_EDICAO,
          justification,
          correctiveAction,
          responsible,
          // nsaApplicable/nsaLocked devem ser definidos ao criar o ciclo
        },
      });

      // 2. Processa cada evidência (links e arquivos)
      for (const [evidenceSlug, data] of Object.entries(evidences)) {
        const requirement = await tx.evidenceRequirement.findUnique({ where: { slug: evidenceSlug } });
        if (!requirement) {
          console.warn(`Evidence requirement com slug ${evidenceSlug} não encontrado.`);
          continue; // Pula para a próxima evidência
        }

        // Encontra ou cria a EvidenceSubmission para este curso e requisito
        const submission = await tx.evidenceSubmission.upsert({
            where: { courseId_requirementId: { courseId, requirementId: requirement.id } },
            update: {
                folderUrls: data.links || [], // Atualiza/sobrescreve os links
                // Poderia concatenar em vez de sobrescrever se desejado: folderUrls: { push: data.links }
            },
            create: {
                courseId,
                requirementId: requirement.id,
                folderUrls: data.links || [],
                // createdByUserId: id do usuário logado (obter da sessão)
            },
        });

        // 3. Cria os registros EvidenceFile para os novos arquivos enviados
        if (data.files && data.files.length > 0) {
          await tx.evidenceFile.createMany({
            data: data.files.map(file => ({
              submissionId: submission.id,
              kind: StorageKind.EXTERNAL, // Usamos Cloudinary como externo
              storageKey: file.storageKey, // public_id
              externalUrl: file.externalUrl, // secure_url
              fileName: file.fileName,
              mimeType: file.mimeType,
              sizeBytes: file.sizeBytes,
              // uploadedByUserId: id do usuário logado
            })),
          });
        }
      }
    }); // Fim da transação

    // Revalida o path para atualizar a UI
    // Idealmente, revalidar o path específico do indicador
    revalidatePath(`/courses/${courseId}/dimensions`); // Revalida a página da dimensão
    return { success: true };

  } catch (error) {
    console.error('Falha ao salvar avaliação do indicador:', error);
    return { errors: { _form: ['Erro inesperado ao salvar no banco de dados.'] }, success: false };
  }
}
