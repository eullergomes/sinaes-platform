import { IndicatorGrade, IndicatorStatus } from '@prisma/client';

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
