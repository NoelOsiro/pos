import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { PriceListListView } from '@/sections/pricelist/view';

export const metadata: Metadata = { title: `Price lists | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PriceListListView />;
}
