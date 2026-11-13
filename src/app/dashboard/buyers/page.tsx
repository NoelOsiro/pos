import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { BuyerListView } from '@/sections/contracts/view';

export const metadata: Metadata = { title: `Buyers | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <BuyerListView />;
}
