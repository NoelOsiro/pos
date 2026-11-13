import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { DndView } from '@/sections/_examples/extra/dnd-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Dnd | Components - ${CONFIG.appName}` };

export default function Page() {
  return <DndView />;
}
