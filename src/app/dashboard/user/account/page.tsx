import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { AccountGeneralView } from '@/sections/account/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Account general settings | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <AccountGeneralView />;
}
