import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { CalendarView } from '@/sections/calendar/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Calendar | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <CalendarView />;
}
