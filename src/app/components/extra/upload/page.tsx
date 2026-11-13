import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { UploadView } from '@/sections/_examples/extra/upload-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Upload | Components - ${CONFIG.appName}` };

export default function Page() {
  return <UploadView />;
}
