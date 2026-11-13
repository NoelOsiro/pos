import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { TimelineView } from '@/sections/_examples/mui/timeline-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Timeline | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <TimelineView />;
}
