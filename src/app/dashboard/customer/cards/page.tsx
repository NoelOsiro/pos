import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { UserCardsView } from '@/sections/user/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `User cards | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <UserCardsView />;
}
