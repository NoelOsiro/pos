import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { ChipView } from '@/sections/_examples/mui/chip-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Chip | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <ChipView />;
}
