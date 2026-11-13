import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { MenuView } from '@/sections/_examples/mui/menu-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Menu | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <MenuView />;
}
