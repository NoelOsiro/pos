import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { BreadcrumbsView } from '@/sections/_examples/mui/breadcrumbs-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Breadcrumbs | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <BreadcrumbsView />;
}
