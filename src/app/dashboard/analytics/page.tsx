import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { OverviewAnalyticsView } from '@/sections/overview/analytics/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Analytics | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewAnalyticsView />;
}
