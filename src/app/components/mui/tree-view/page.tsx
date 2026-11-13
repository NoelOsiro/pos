import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { TreeView } from '@/sections/_examples/mui/tree-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Tree view | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <TreeView />;
}
