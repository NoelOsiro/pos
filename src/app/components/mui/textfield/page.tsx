import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { TextfieldView } from '@/sections/_examples/mui/textfield-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Textfield | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <TextfieldView />;
}
