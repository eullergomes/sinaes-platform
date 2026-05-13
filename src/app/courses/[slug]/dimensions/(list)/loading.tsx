import { Skeleton } from '@/components/ui/skeleton';
import DimensionItemSkeleton from '@/components/dimension-item-skeleton';

export default function LoadingDimensions() {
  return (
    <div className="space-y-6 p-6">
      {/* Skeleton do Header da página */}
      <div className="flex animate-pulse flex-col space-y-2">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>

      {/* Skeleton do Select de Ano */}
      <div className="flex w-full max-w-sm animate-pulse flex-col space-y-2">
        <Skeleton className="mb-2 h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Reutilizando o seu componente de skeleton para a grade de cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <DimensionItemSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}