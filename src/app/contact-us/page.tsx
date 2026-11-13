import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { ContactView } from '@/sections/contact/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Contact us - ${CONFIG.appName}` };

export default function Page() {
  return <ContactView />;
}
