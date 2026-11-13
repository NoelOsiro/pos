import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { MaintenanceView } from '@/sections/maintenance/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Maintenance - ${CONFIG.appName}` };

export default function Page() {
  return <MaintenanceView />;
}
