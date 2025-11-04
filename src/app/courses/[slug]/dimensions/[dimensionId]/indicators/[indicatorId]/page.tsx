import ClientIndicatorPage from '@/components/ClientIndicatorPage';

type Params = { slug: string; dimensionId: string; indicatorId: string };

export default async function IndicadorPage({
  params
}: {
  params: Promise<Params>;
}) {
  const resolved = await params;
  return (
    <ClientIndicatorPage
      slug={resolved.slug}
      indicadorCode={resolved.indicatorId}
      dimensionId={resolved.dimensionId}
    />
  );
}
