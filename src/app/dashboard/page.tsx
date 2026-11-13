import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { OverviewAppView } from '@/sections/overview/app/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewAppView />;
}
