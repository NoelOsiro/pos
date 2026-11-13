import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { VoucherCreateView } from '@/sections/voucher/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new user | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <VoucherCreateView />;
}
