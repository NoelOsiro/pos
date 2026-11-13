import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { CollectionsAnalyticsView } from '@/sections/collections/view';

export const metadata: Metadata = { title: `Collections analytics | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <CollectionsAnalyticsView />;
}
