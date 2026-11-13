import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { AccountBillingView } from '@/sections/account/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Account billing settings | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <AccountBillingView />;
}
