import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { AccountSocialsView } from '@/sections/account/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Account socials settings | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <AccountSocialsView />;
}
