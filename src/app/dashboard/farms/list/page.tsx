import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { FarmListView } from '@/sections/farms/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Farms list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <FarmListView />;
  }
