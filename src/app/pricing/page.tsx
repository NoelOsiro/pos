import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { PricingView } from '@/sections/pricing/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Pricing - ${CONFIG.appName}` };

export default function Page() {
  return <PricingView />;
}
