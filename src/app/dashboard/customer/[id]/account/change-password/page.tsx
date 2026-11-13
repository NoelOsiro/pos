import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { AccountChangePasswordView } from '@/sections/account/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Account change password settings | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <AccountChangePasswordView />;
}
