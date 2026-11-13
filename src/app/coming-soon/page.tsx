import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { ComingSoonView } from '@/sections/coming-soon/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Coming soon - ${CONFIG.appName}` };

export default function Page() {
  return <ComingSoonView />;
}
