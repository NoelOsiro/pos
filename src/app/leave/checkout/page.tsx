import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { CheckoutView } from '@/sections/checkout/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Checkout - ${CONFIG.appName}` };

export default function Page() {
  return <CheckoutView />;
}
