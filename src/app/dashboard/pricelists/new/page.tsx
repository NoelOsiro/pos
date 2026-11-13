import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { PriceListNewView } from '@/sections/pricelist/view';

export const metadata: Metadata = { title: `New price list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PriceListNewView />;
}
