import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { FaqsView } from '@/sections/faqs/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Faqs - ${CONFIG.appName}` };

export default function Page() {
  return <FaqsView />;
}
