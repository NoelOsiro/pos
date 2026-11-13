import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { DataGridView } from '@/sections/_examples/mui/data-grid-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `DataGrid | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <DataGridView />;
}
