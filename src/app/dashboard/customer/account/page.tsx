import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { AccountGeneralView } from '@/sections/customer/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Account general settings | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <AccountGeneralView id='1'/>;
}
