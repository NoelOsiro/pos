import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { ValuationListView } from '@/sections/valuation/view';

export const metadata: Metadata = { title: `Valuations list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ValuationListView />;
}
