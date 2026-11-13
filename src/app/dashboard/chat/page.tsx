import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { ChatView } from '@/sections/chat/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Chat | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ChatView />;
}
