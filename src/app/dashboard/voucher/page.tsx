import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { OverviewCourseView } from '@/sections/overview/course/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Course | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewCourseView />;
}
