import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { CarouselView } from '@/sections/_examples/extra/carousel-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Carousel | Components - ${CONFIG.appName}` };

export default function Page() {
  return <CarouselView />;
}
