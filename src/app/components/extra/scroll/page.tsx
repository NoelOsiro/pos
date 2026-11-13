import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { ScrollbarView } from '@/sections/_examples/extra/scrollbar-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Scrollbar | Components - ${CONFIG.appName}` };

export default function Page() {
  return <ScrollbarView />;
}
