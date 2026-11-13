import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { FarmCreateView } from '@/sections/farms/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new farm | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <FarmCreateView />;
}
