import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { DialogView } from '@/sections/_examples/mui/dialog-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Dialog | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <DialogView />;
}
