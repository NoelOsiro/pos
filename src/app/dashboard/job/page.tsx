import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { JobListView } from '@/sections/job/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Job list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <JobListView />;
}
