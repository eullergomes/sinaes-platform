import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface DimensionCardProps {
  dimId: '1' | '2' | '3' | string;
  title: string;
  description?: string;
  grade: number;
  href: string;
  className?: string;
}

export default function DimensionCard({
  dimId,
  title,
  description,
  grade,
  href,
  className
}: DimensionCardProps) {
  return (
    <Card
      className={className ?? 'transition-shadow duration-200 hover:shadow-lg'}
    >
      <CardHeader>
        <CardTitle>Dimensão {dimId}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xl font-semibold">{title}</p>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
        <p className="mt-2 text-lg">
          <span className="font-semibold">Nota atual:</span> {grade.toFixed(1)}
        </p>

        <div className="pt-2">
          <Button asChild className="bg-green-700 hover:bg-green-800">
            <Link href={href}>Ver indicadores</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
