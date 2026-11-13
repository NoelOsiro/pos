import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { TabsView } from '@/sections/_examples/mui/tabs-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Tabs | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <TabsView />;
}
