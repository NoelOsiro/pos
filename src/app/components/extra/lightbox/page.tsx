import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { LightboxView } from '@/sections/_examples/extra/lightbox-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Lightbox | Components - ${CONFIG.appName}` };

export default function Page() {
  return <LightboxView />;
}
