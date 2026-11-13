import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { ShadowsView } from '@/sections/_examples/foundation/shadows-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Shadows | Foundations - ${CONFIG.appName}` };

export default function Page() {
  return <ShadowsView />;
}
