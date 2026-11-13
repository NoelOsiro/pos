import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { TypographyView } from '@/sections/_examples/foundation/typography-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Typography | Foundations - ${CONFIG.appName}` };

export default function Page() {
  return <TypographyView />;
}
