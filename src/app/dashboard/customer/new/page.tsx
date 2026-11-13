import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { CustomerCreateView } from '@/sections/customer/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new user | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <CustomerCreateView />;
}
