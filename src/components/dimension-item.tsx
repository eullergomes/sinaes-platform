import Link from 'next/link';
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
  const badgeClass =
    dimensionWithGrade.averageGrade >= 4
      ? 'bg-green-600 text-white'
      : dimensionWithGrade.averageGrade >= 3
        ? 'bg-yellow-500 text-white'
        : 'bg-red-600 text-white';

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
        <Button asChild className="w-full mt-4 bg-green-600 hover:bg-green-700">
          <Link
            href={`/courses/${slug}/dimensions/${dimensionWithGrade.number}${currentYear ? `?year=${currentYear}` : ''}`}
          >
            Ver Indicadores <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default DimensionItem;