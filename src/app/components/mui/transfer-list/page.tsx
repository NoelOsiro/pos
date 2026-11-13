import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { TransferListView } from '@/sections/_examples/mui/transfer-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Transfer list | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <TransferListView />;
}
