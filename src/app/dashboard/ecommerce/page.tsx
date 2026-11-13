import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { OverviewEcommerceView } from '@/sections/overview/e-commerce/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `E-commerce | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewEcommerceView />;
}
