import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { InvoiceListView } from '@/sections/invoice/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Invoice list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <InvoiceListView />;
}
