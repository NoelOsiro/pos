import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { OrderListView } from '@/sections/order/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Order list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OrderListView />;
}
