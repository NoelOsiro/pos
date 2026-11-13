import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { ProgressView } from '@/sections/_examples/mui/progress-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Progress | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <ProgressView />;
}
