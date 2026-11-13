import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { FarmerCreateView } from '@/sections/farmer/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new farmer | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <FarmerCreateView />;
}
