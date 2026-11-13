import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { TableView } from '@/sections/_examples/mui/table-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Table | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <TableView />;
}
