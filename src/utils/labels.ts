import { CourseLevel, CourseModality } from '@prisma/client';

export const labelForCourseLevel = (level: CourseLevel): string => {
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

export const labelForCourseModality = (modality: CourseModality): string => {
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

export const labelForUserRole = (role: string): string => {
  switch (role) {
    case 'ADMIN':
      return 'Administrador';
    case 'DIRECTOR':
      return 'Direção';
    case 'COORDINATOR':
      return 'Coordenador';
    case 'VISITOR':
      return 'Visitante';
    default:
      return String(role)
        .toLowerCase()
        .replace(/^(.)/, (c) => c.toUpperCase());
  }
}