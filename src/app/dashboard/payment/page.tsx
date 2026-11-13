import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { OverviewBankingView } from '@/sections/overview/banking/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Banking | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewBankingView />;
}
