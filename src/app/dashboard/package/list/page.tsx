import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { PackageListView } from '@/sections/package/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Package list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PackageListView />;
}
