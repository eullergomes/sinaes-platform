import ClientDimensionPage from '@/components/ClientDimensionPage';

type Params = { slug: string; dimensionId: string };
type SearchParams = { year?: string };

export default async function DimensionPage({
  params,
  searchParams
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await params;
  const { slug, dimensionId: dimId } = resolved;
  const { year } = await searchParams;

  return <ClientDimensionPage slug={slug} dimId={dimId} year={year} />;
}
