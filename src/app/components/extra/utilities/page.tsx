import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { UtilitiesView } from '@/sections/_examples/extra/utilities-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Utilities | Components - ${CONFIG.appName}` };

export default function Page() {
  return <UtilitiesView />;
}
