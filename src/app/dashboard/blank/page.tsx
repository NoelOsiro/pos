import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { BlankView } from '@/sections/blank/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Blank | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <BlankView />;
}
