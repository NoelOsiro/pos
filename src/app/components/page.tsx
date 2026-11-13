import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { ComponentsView } from '@/sections/_examples/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `All components | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <ComponentsView />;
}
