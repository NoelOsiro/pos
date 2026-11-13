import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { PackageCreateView } from '@/sections/package/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new user | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PackageCreateView />;
}
