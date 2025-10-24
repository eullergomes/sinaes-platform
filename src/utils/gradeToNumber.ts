import { IndicatorGrade } from "@prisma/client";

export const gradeToNumber = (grade: IndicatorGrade): number => {
  if (grade === 'NSA') return 0;
  return parseInt(grade.slice(1));
};