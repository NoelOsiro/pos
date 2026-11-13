import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { LayoutView } from '@/sections/_examples/extra/layout-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Layout | Components - ${CONFIG.appName}` };

export default function Page() {
  return <LayoutView />;
}
