import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardHeader } from './ui/card';

const DimensionItemSkeleton = () => {
	return (
		<Card className="hover:border-primary flex h-full flex-col transition-all">
			<CardHeader>
				<div className="flex items-center justify-between">
					<Skeleton className="h-5 w-32" />
					<Skeleton className="h-6 w-24" />
				</div>

				<Skeleton className="mt-2 h-4 w-3/4" />
			</CardHeader>

			<CardContent className="flex flex-1 flex-col justify-between">
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-11/12" />
					<Skeleton className="h-4 w-4/5" />
				</div>

				<Skeleton className="mt-4 h-9 w-full" />
			</CardContent>
		</Card>
	);
};

export default DimensionItemSkeleton;