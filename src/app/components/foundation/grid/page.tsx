import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { GridView } from '@/sections/_examples/foundation/grid-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Grid | Foundations - ${CONFIG.appName}` };

export default function Page() {
  return <GridView />;
}
