import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { getPosDashboardData } from '@/app/dashboard/actions';
import { OverviewEcommerceView } from '@/sections/overview/e-commerce/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `E-commerce | Dashboard - ${CONFIG.appName}` };

export default async function Page() {
  const dashboardData = await getPosDashboardData();

  return <OverviewEcommerceView initialData={dashboardData} />;
}
