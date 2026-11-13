import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { BadgeView } from '@/sections/_examples/mui/badge-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Badge | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <BadgeView />;
}
