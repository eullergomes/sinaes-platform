import { z } from 'zod';
import { CourseLevel, CourseModality } from '@prisma/client';

const courseLevelValues = Object.values(CourseLevel) as [
  CourseLevel,
  ...CourseLevel[]
];
const courseModalityValues = Object.values(CourseModality) as [
  CourseModality,
  ...CourseModality[]
];

export const courseSchema = z.object({
  name: z.string().trim().min(1, 'O nome do curso é obrigatório.'),
  level: z.enum(courseLevelValues, {
    message: 'O grau do curso é obrigatório.'
  }),
  modality: z.enum(courseModalityValues, {
    message: 'A modalidade do curso é obrigatória.'
  }),
  emecCode: z
    .string()
    .trim()
    .min(1, 'O código e-MEC é obrigatório.')
    .regex(/^\d+$/, 'O código e-MEC deve conter apenas números.')
    .transform((v) => parseInt(v, 10))
    .pipe(
      z.number().int().positive('O código e-MEC deve ser um inteiro positivo.')
    ),
  ppcDocumentUrl: z.string().trim().url('A URL do PPC deve ser válida.').optional().or(z.literal('')),
  coordinatorId: z.string().trim().min(1, 'O coordenador é obrigatório.')
});

export type CourseInput = z.infer<typeof courseSchema>;
