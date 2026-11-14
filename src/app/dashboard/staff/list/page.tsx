import type { Metadata } from 'next';
import { CONFIG } from '@/global-config';

import { AgentListView } from '@/sections/agent/view';

export const metadata: Metadata = { title: `Agents list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <AgentListView />;
}
