import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { RatingView } from '@/sections/_examples/mui/rating-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Rating | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <RatingView />;
}
