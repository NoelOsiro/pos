import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { SwitchView } from '@/sections/_examples/mui/switch-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Switch | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <SwitchView />;
}
