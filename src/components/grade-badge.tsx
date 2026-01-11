import * as React from 'react';

import { Badge } from './ui/badge';

type Props = {
  grade: number | null | undefined;
  label?: string;
  decimals?: number;
  className?: string;
};

function getGradeClass(grade: number): string {
  if (grade >= 4) return 'bg-green-600 text-white';
  if (grade >= 3) return 'bg-yellow-500 text-white';
  return 'bg-red-600 text-white';
}

export default function GradeBadge({
  grade,
  label = 'Nota',
  decimals = 2,
  className
}: Props): React.JSX.Element {
  const safeGrade = Number.isFinite(grade as number) ? (grade as number) : 0;
  const clamped = Math.max(0, Math.min(5, safeGrade));

  return (
    <Badge className={`${getGradeClass(clamped)} ${className ?? ''}`.trim()}>
      {label}: {clamped.toFixed(decimals)}
    </Badge>
  );
}
