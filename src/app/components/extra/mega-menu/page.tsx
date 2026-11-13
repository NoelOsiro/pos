import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { MegaMenuView } from '@/sections/_examples/extra/mega-menu-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Mega menu | Components - ${CONFIG.appName}` };

export default function Page() {
  return <MegaMenuView />;
}
