import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { MailView } from '@/sections/mail/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Mail | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <MailView />;
}
