import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { KanbanView } from '@/sections/kanban/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Kanban | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <KanbanView />;
}
