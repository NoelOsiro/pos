import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { ColorsView } from '@/sections/_examples/foundation/colors-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Colors | Foundations - ${CONFIG.appName}` };

export default function Page() {
  return <ColorsView />;
}
