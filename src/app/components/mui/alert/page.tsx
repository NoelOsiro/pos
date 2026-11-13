import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { AlertView } from '@/sections/_examples/mui/alert-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Alert | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <AlertView />;
}
