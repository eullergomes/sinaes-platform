import { IndicatorStatus } from '@prisma/client';

export enum IndicatorGrade {
  G1 = 'G1',
  G2 = 'G2',
  G3 = 'G3',
  G4 = 'G4',
  G5 = 'G5',
  NSA = 'NSA'
}

export type Evaluation = {
  year: number;
  grade: IndicatorGrade;
  status: IndicatorStatus;
  nsaApplicable: boolean;
  nsaLocked: boolean;
  lastUpdate: string | null;
};

export type IndicatorWithEvaluations = {
  code: string;
  name: string;
  evaluations: Evaluation[];
};

export type DimensionApiResponse = {
  course: { id?: string; name: string; slug: string };
  dimension: { number: number; title: string };
  indicators: IndicatorWithEvaluations[];
};
