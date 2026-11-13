import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { TourListView } from '@/sections/tour/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Tour list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <TourListView />;
}
