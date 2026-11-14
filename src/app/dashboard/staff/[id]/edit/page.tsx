import type { Metadata } from 'next';
import { CONFIG } from '@/global-config';

import { AgentEditView } from '@/sections/agent/view';

export const metadata: Metadata = { title: `Edit agent | Dashboard - ${CONFIG.appName}` };

export default function Page({ params }: { params: { id: string } }) {
  return <AgentEditView agent={{ id: params.id }} />;
}
