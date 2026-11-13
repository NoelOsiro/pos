import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { ButtonView } from '@/sections/_examples/mui/button-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Button | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <ButtonView />;
}
