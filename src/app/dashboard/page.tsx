import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { OverviewEcommerceView } from '@/sections/overview/e-commerce/view';
import { getPosDashboardData } from './actions';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Dashboard - ${CONFIG.appName}` };

export const dynamic = 'force-dynamic';

export default async function Page() {
  const dashboardData = await getPosDashboardData();

  return <OverviewEcommerceView initialData={dashboardData} />;
}
