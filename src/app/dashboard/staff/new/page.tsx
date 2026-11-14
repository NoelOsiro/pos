import type { Metadata } from 'next';
import { CONFIG } from '@/global-config';

import { AgentCreateView } from '@/sections/agent/view';

export const metadata: Metadata = { title: `Invite agent | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <AgentCreateView />;
}
