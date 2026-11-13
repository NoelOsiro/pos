import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { RadioButtonView } from '@/sections/_examples/mui/radio-button-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Radio button | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <RadioButtonView />;
}
