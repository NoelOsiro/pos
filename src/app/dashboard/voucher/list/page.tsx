import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { VoucherListView } from '@/sections/voucher/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Package list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <VoucherListView />;
}
