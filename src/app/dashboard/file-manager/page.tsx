import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { FileManagerView } from '@/sections/file-manager/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `File manager | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <FileManagerView />;
}
