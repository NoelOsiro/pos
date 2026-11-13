import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { PackageCardsView } from '@/sections/package/view';



// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `User cards | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PackageCardsView />;
}
