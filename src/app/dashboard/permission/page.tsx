import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { PermissionDeniedView } from '@/sections/permission/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Permission | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PermissionDeniedView />;
}
