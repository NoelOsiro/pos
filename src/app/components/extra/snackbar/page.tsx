import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { SnackbarView } from '@/sections/_examples/extra/snackbar-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Snackbar | Components - ${CONFIG.appName}` };

export default function Page() {
  return <SnackbarView />;
}
