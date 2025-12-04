import { IndicatorStatus } from '@prisma/client';

export type ApiAlert = {
  dimensionId: number;
  dimensionLabel: string;
  code: string;
  name: string;
  status: IndicatorStatus;
  lastUpdate: string | null;
  year: number;
};

export type ApiResponseSingleYear = {
  course: { id: string; slug: string; name: string };
  availableYears: number[];
  year: number;
  alerts: ApiAlert[];
};
