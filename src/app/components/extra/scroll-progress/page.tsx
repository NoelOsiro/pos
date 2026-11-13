import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { ScrollProgressView } from '@/sections/_examples/extra/scroll-progress-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Scroll progress | Components - ${CONFIG.appName}` };

export default function Page() {
  return <ScrollProgressView />;
}
