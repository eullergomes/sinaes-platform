'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card';
import { ArrowRight } from 'lucide-react';
import { DimensionDefinition } from '@prisma/client';

type DimensionWithGrade = DimensionDefinition & {
  averageGrade: number;
};

type Props = {
  slug: string;
  dimensionWithGrade: DimensionWithGrade;
  currentYear?: number;
};

const DimensionItem = ({ slug, dimensionWithGrade, currentYear }: Props) => {
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();

  const badgeClass =
    dimensionWithGrade.averageGrade >= 4
      ? 'bg-green-600 text-white'
      : dimensionWithGrade.averageGrade >= 3
        ? 'bg-yellow-500 text-white'
        : 'bg-red-600 text-white';

  const href = `/courses/${slug}/dimensions/${dimensionWithGrade.number}${
    currentYear ? `?year=${currentYear}` : ''
  }`;

  return (
    <Card className="hover:border-primary flex flex-col transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Dimensão {dimensionWithGrade.number}
          </CardTitle>
          <Badge className={badgeClass}>
            Nota: {dimensionWithGrade.averageGrade.toFixed(2)}
          </Badge>
        </div>
        <p className="font-semibold">{dimensionWithGrade.title}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between">
        <CardDescription>{dimensionWithGrade?.description}</CardDescription>
        <Button
          type="button"
          className="mt-4 w-full bg-green-600 hover:bg-green-700"
          disabled={isNavigating}
          aria-busy={isNavigating || undefined}
          onMouseEnter={() => router.prefetch(href)}
          onFocus={() => router.prefetch(href)}
          onClick={() => {
            startTransition(() => {
              router.push(href);
            });
          }}
        >
          Ver Indicadores <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default DimensionItem;
