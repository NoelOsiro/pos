import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { FarmerListView } from '@/sections/farmer/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Farmers list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <FarmerListView />;
}
