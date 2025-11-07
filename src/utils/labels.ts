import { CourseLevel, CourseModality } from '@prisma/client';

export function labelForCourseLevel(level: CourseLevel): string {
  switch (level) {
    case 'TECNOLOGO':
      return 'Tecnólogo';
    case 'LICENCIATURA':
      return 'Licenciatura';
    case 'BACHARELADO':
      return 'Bacharelado';
    default:
      return String(level)
        .toLowerCase()
        .replace(/^(.)/, (c) => c.toUpperCase());
  }
}

export function labelForCourseModality(modality: CourseModality): string {
  switch (modality) {
    case 'PRESENCIAL':
      return 'Presencial';
    case 'HIBRIDO':
      return 'Híbrido';
    case 'EAD':
      return 'EaD';
    default:
      return String(modality)
        .toLowerCase()
        .replace(/^(.)/, (c) => c.toUpperCase());
  }
}
