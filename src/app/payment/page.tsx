import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { PaymentView } from '@/sections/payment/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Payment - ${CONFIG.appName}` };

export default function Page() {
  return <PaymentView />;
}
