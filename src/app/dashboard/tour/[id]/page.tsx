import type { Metadata } from 'next';

import { _tours } from '@/_mock/_tour';
import { CONFIG } from '@/global-config';

import { TourDetailsView } from '@/sections/tour/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Tour details | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const currentTour = _tours.find((tour) => tour.id === id);

  return <TourDetailsView tour={currentTour} />;
}

// ----------------------------------------------------------------------

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 * Will remove in Next.js v15
 */
export const dynamic = 'force-dynamic';

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    return _tours.map((tour) => ({ id: tour.id }));
  }
  return [];
}
