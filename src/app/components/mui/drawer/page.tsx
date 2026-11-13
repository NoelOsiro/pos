import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { DrawerView } from '@/sections/_examples/mui/drawer-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Drawer | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <DrawerView />;
}
