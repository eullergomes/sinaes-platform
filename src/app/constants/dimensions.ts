// app/constants/sinaes.ts

export type DimensionId = '1' | '2' | '3';

export const DIMENSIONS: Record<
  DimensionId,
  { title: string; description: string }
> = {
  '1': {
    title: 'Organização Didático-Pedagógica',
    description: 'Dimensão 1 — aspectos do PPC, estrutura curricular, metodologias, avaliação da aprendizagem e apoio ao discente.'
  },
  '2': {
    title: 'Corpo Docente e Tutorial',
    description: 'Dimensão 2 — NDE, coordenação, experiência e regime de trabalho docente/tutoria, colegiado e produção acadêmica.'
  },
  '3': {
    title: 'Infraestrutura',
    description: 'Dimensão 3 — salas, laboratórios, bibliotecas, espaços de trabalho e demais recursos físicos e tecnológicos.'
  }
} as const;
