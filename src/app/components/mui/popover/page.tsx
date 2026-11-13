import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { PopoverView } from '@/sections/_examples/mui/popover-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Popover | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <PopoverView />;
}
