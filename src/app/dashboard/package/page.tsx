import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { UserProfileView } from '@/sections/user/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `User profile | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <UserProfileView />;
}
