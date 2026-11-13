import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { InvoiceCreateView } from '@/sections/invoice/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new invoice | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <InvoiceCreateView />;
}
