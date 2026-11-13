import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { ListView } from '@/sections/_examples/mui/list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `List | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <ListView />;
}
