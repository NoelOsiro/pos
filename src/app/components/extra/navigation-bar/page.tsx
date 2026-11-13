import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { NavigationBarView } from '@/sections/_examples/extra/navigation-bar-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Navigation bar | Components - ${CONFIG.appName}` };

export default function Page() {
  return <NavigationBarView />;
}
