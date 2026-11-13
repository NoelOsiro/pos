import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { StepperView } from '@/sections/_examples/mui/stepper-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Stepper | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <StepperView />;
}
